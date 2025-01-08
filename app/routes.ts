import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

    layout("./auth/layout.tsx", [
        route("sign-in", "./auth/sign-in.tsx"),
        route("sign-up", "./auth/sign-up.tsx"),
    ])

] satisfies RouteConfig;
