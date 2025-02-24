import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout("routes/auth/layout.tsx", [
        route("sign-in", "routes/auth/sign-in.tsx"),
        route("sign-up", "routes/auth/sign-up.tsx"),
    ]),
    layout("routes/protected/layout.tsx", [
        route("chat", "routes/protected/chat.tsx"),
    ])

] satisfies RouteConfig;
