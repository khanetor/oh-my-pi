import { describe, expect, it, vi } from "bun:test";
import { loginNeuralwatt } from "@oh-my-pi/pi-ai/registry/neuralwatt";
import type { FetchImpl } from "@oh-my-pi/pi-ai/types";

describe("neuralwatt login", () => {
	it("validates API key without requiring a specific model entitlement", async () => {
		const fetchMock: FetchImpl = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
			const url = typeof input === "string" ? input : input.toString();
			expect(url).toBe("https://api.neuralwatt.com/v1/models");
			expect(init?.method).toBe("GET");
			expect(init?.headers).toEqual({ Authorization: "Bearer sk-test" });
			return new Response(JSON.stringify({ object: "list", data: [] }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		});

		const apiKey = await loginNeuralwatt({
			onPrompt: async () => "sk-test",
			fetch: fetchMock,
		});

		expect(apiKey).toBe("sk-test");
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it("surfaces validation errors from models endpoint", async () => {
		const fetchMock: FetchImpl = vi.fn(async () => {
			return new Response('{"code":"invalid_api_key"}', {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		});

		await expect(
			loginNeuralwatt({
				onPrompt: async () => "sk-test",
				fetch: fetchMock,
			}),
		).rejects.toThrow("Neuralwatt API key validation failed (401)");
	});
});
