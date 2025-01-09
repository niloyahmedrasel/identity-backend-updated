import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";
import fs from "fs";
import { ApiError, ApiResponse, generateMetadata } from "../utils/api.response";
import { AuthService } from "../service/AuthService";
import { logger } from "../config/logger";
import { decode } from "punycode";
import path from "path";

interface KeycloakConfig {
  realm: string;
  "auth-server-url": string;
  "ssl-required": string;
  resource: string;
  credentials: {
    secret: string;
  };
}

const loadKeycloakConfig = (): KeycloakConfig => {
    const configPath = path.resolve(__dirname, "../../keycloak.json");

    // Read the file and parse it
    const configData = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(configData) as KeycloakConfig;
};

class KeyCloak {
  static cachedPublicKey: string | null = null;
  static publicKeyFetchTime: number | null = null;

  // Middleware function that checks if the request has a valid token
  static middleware = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No token providedX");
      }
      const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
      const decoded = jwt.decode(token); // Casting to JwtPayload to access claims like exp

      res.locals.kauth = {
        authService: AuthService.createFromTokenContent(decoded),
      };
      console.log(token, "--------------", decoded);

      console.log("tantana----------tana tana", res.locals.kauth);
    } catch (error: any) {
      console.error(error.message);
      res.locals.kauth = undefined;
    } finally {
      next();
    }
  };

  // verify that token is valid
  static async verify(token: string) {
    const keycloakConfig = loadKeycloakConfig();

    const KEYCLOAK_URL = keycloakConfig["auth-server-url"].replace(/\/$/, ""); // Remove trailing slash if exists
    const REALM_NAME = keycloakConfig.realm;
    const PUBLIC_KEY_URL = `${KEYCLOAK_URL}/realms/${REALM_NAME}/protocol/openid-connect/certs`;

    const loadAndCachePublicKey = async () => {
      logger.debug(`Loading Keycloak public key from: ${PUBLIC_KEY_URL}`);
      const now = Date.now();
      try {
        const response = await axios.get(PUBLIC_KEY_URL);
        const key = response.data.keys[0]; // Assuming the first key is the one to be used
        const publicKey = `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----`;
        // Cache the public key and timestamp
        KeyCloak.cachedPublicKey = publicKey;
        KeyCloak.publicKeyFetchTime = now;
        logger.debug("Keycloak public key loaded and cached.");
      } catch (error: any) {
        logger.debug("Failed to load Keycloak public key:", error);
        throw new Error("Failed to get Keycloak public key: " + error.message);
      }
    };

    const getKeycloakPublicKey = async (): Promise<string> => {
      const now = Date.now();

      // Check if the public key is cached and still valid
      if (
        KeyCloak.cachedPublicKey &&
        KeyCloak.publicKeyFetchTime &&
        now - KeyCloak.publicKeyFetchTime < 1 * 60 * 60 * 1000
      ) {
        // console.log("Using cached Keycloak public key");
        return KeyCloak.cachedPublicKey;
      }

      // If public key is not cached or expired, load it
      loadAndCachePublicKey();

      // Check for the availability of the cached public key up to 10 times, every 1 second
      for (let attempts = 0; attempts < 10; attempts++) {
        if (KeyCloak.cachedPublicKey) {
          return KeyCloak.cachedPublicKey;
        }
        // Wait for 1 second before checking again
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      logger.debug(
        "Failed to get Keycloak public key after multiple attempts."
      );
      throw new Error(
        "Failed to get Keycloak public key after multiple attempts."
      );
    };

    const publicKey = await getKeycloakPublicKey();

    try {
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ["RS256"], // Keycloak signs tokens with RS256
        issuer: `${KEYCLOAK_URL}/realms/${REALM_NAME}`, // Optional: Validate issuer
      }); // Casting to JwtPayload to access claims like exp
      return decoded;
    } catch (error: any) {
      // console.error("Failed to verify token:", error);
      throw new ApiError({
        message: "Failed to verify token: " + error.message,
        status: 401,
      });
    }
  }

  // Main method that will act as role check and auth middleware
  // Middleware to check for role permissions
  static protect = (resource?: string, action?: string, domain?: string)=> {
    return async (req: Request, res: Response, next: NextFunction):Promise<any> => {
      console.log("hi-----------hi-------");
      try {
        const authService = res.locals.kauth?.authService;
        console.log("---------------", authService);

        // Check if the authorization header is present and starts with 'Bearer'
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          throw new Error("No token providedY");
        }

        // Check if token data exists
        if (!authService) {
          throw new Error("Token Invalid or Malformed");
        }

        // Simulate token verification (you can implement your own logic or call external service)
        await KeyCloak.verify(authHeader.split(" ")[1]);

        // If no specific permission is provided, just validate token existence
        if (!resource && !action && !domain) {
          console.log(
            "No specific permission required, token is valid, allow access"
          );
          return next();
        }

        authService.setRoutePermission({ resource, action, domain });

        // Check if the user has the required role by comparing resource, action, and domain
        const hasRequiredPermission = authService.hasPermission(
          { resource, action, domain },
          { throwError: true }
        );

        if (hasRequiredPermission) {
          console.log(
            `User has the required role: ${resource || "any"}.${
              action || "any"
            }${domain ? "." + domain : ""}, allow access`
          );
          return next();
        }
      } catch (error: ApiError | any) {
        return ApiResponse.error({
          response: res,
          error: error,
          metadata: generateMetadata("1.0.0", "auth-middleware"),
        });
      }
    };
  };
}

export default KeyCloak;
