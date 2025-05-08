import { intercept } from "./intercept-http";
import { setup } from "./messaging";
console.log("--- injected script ---");

setup();
intercept();