import "../app.css";
import "@fontsource-variable/inter";
import "$lib/theme";

import { dev } from "$app/environment";
import { inject } from "@vercel/analytics";

inject({ mode: dev ? "development" : "production" });
