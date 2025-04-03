import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    layout("routes/auth/layout.tsx", [
        route("sign-in", "routes/auth/sign-in.tsx"),
        route("sign-up", "routes/auth/sign-up.tsx"),
    ]),
    layout("routes/protected/layout.tsx", [
        route("chat", "routes/protected/chat.tsx"),
    ]),
    // Proxy Middleware Routes
    ...prefix("api", [
        ...prefix("conversations", [
            index("routes/api/conversations/conversations.ts"),
            route(":conversationId/messages", "routes/api/conversations/$conversationId/messages/messages.ts"),
        ]),
        ...prefix("user", [
            index("routes/api/user/user.ts"),
        ])
    ])


] satisfies RouteConfig;
