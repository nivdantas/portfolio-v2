import { createHash, randomUUID } from "node:crypto";
import type { Publication, PublicationStore } from "./publisher.ts";

type RedisArgument = string | number;

export class RedisPublicationStore implements PublicationStore {
  readonly prefix: string;
  private url: string;
  private token: string;
  constructor(url: string, token: string, account: string, site: string) {
    this.url = url;
    this.token = token;
    this.prefix = `portfolio:linkedin:${createHash("sha256").update(`${account}:${site}`).digest("hex").slice(0, 20)}`;
  }
  async command<T>(args: RedisArgument[]): Promise<T> {
    const response = await fetch(this.url, {
      method: "POST",
      redirect: "error",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Publication storage is unavailable");
    const data = await response.json();
    if (data.error) throw new Error("Publication storage command failed");
    return data.result as T;
  }
  key(id: string) {
    return `${this.prefix}:post:${createHash("sha256").update(id).digest("hex")}`;
  }
  async baseline() {
    return this.command<string | null>(["GET", `${this.prefix}:baseline`]);
  }
  async initialize(at: string) {
    return (
      (await this.command(["SET", `${this.prefix}:baseline`, at, "NX"])) ===
      "OK"
    );
  }
  async get(id: string) {
    const value = await this.command<string | null>(["GET", this.key(id)]);
    return value ? (JSON.parse(value) as Publication) : null;
  }
  async insert(id: string, value: Publication) {
    return (
      (await this.command([
        "SET",
        this.key(id),
        JSON.stringify(value),
        "NX",
      ])) === "OK"
    );
  }
  async compareAndSet(id: string, previous: Publication, value: Publication) {
    return (
      (await this.command<number>([
        "EVAL",
        "if redis.call('GET',KEYS[1]) == ARGV[1] then redis.call('SET',KEYS[1],ARGV[2]); return 1 else return 0 end",
        1,
        this.key(id),
        JSON.stringify(previous),
        JSON.stringify(value),
      ])) === 1
    );
  }
  async acquireLock() {
    const owner = randomUUID();
    const ok = await this.command([
      "SET",
      `${this.prefix}:lock`,
      owner,
      "NX",
      "EX",
      120,
    ]);
    return ok === "OK" ? owner : null;
  }
  async releaseLock(owner: string) {
    await this.command([
      "EVAL",
      "if redis.call('GET',KEYS[1]) == ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end",
      1,
      `${this.prefix}:lock`,
      owner,
    ]);
  }
}
