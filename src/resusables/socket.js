import io from "socket.io-client";

const ENDPOINT = "https://chitchat-service-api.onrender.com";
// const ENDPOINT = "http://localhost:5000"; // use this when developing

const socket = io(ENDPOINT);

export default socket;
