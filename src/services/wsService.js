// src/services/wsService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function initWebSocket(dispatch) {
  const accesstoken = sessionStorage.getItem("accesstoken");
  const endpoints = [
    {
      url: "http://localhost:8082/ws",
      handlers: [
        { topic: "/topic/stockStatus", action: "updateStockStatus" },
        { topic: "/topic/totalProfit", action: "updateTotalProfit" },
        { topic: "/topic/topLeastProducts", action: "updateTopLeast" },
      ],
    },
    {
      url: "http://localhost:8081/ws",
      handlers: [
        { topic: "/topic/totalProducts", action: "updateTotalProducts" },
      ],
    },
  ];

  // Keep track of clients for teardown
  const clients = endpoints.map((ep) => {
    const client = new Client({
      // Defer to SockJS for browser compatibility
      webSocketFactory: () => new SockJS(ep.url),
      connectHeaders: { Authorization: `Bearer ${accesstoken}` },
      onConnect: () => {
        ep.handlers.forEach(({ topic, action }) => {
          client.subscribe(topic, (msg) => {
            const payload = JSON.parse(msg.body);
            dispatch({ type: `dashboard/${action}`, payload });
          });
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
      debug: (str) => {
        // Toggle this for verbose logging
        console.debug(str);
      },
    });

    client.activate();
    return client;
  });

  // Return a cleanup function for component unmount
  return () => {
    clients.forEach((client) => client.deactivate());
  };
}
