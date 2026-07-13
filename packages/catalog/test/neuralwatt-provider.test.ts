import { describe, expect, test } from "bun:test";
import {
	CATALOG_PROVIDERS,
	DEFAULT_MODEL_PER_PROVIDER,
	PROVIDER_DESCRIPTORS,
} from "@oh-my-pi/pi-catalog/provider-models/descriptors";
import { neuralwattModelManagerOptions } from "@oh-my-pi/pi-catalog/provider-models/openai-compat";

describe("Neuralwatt built-in provider", () => {
	test("registers catalog descriptor with NEURALWATT_API_KEY env discovery", () => {
		const descriptor = PROVIDER_DESCRIPTORS.find(item => item.providerId === "neuralwatt");
		const entry = CATALOG_PROVIDERS.find(item => item.id === "neuralwatt");
		expect(descriptor).toBeDefined();
		expect(descriptor?.defaultModel).toBe("glm-5.2-short");
		expect(entry?.envVars).toContain("NEURALWATT_API_KEY");
		expect(DEFAULT_MODEL_PER_PROVIDER.neuralwatt).toBe("glm-5.2-short");
	});

	test("configures Neuralwatt model manager options", () => {
		const options = neuralwattModelManagerOptions();
		expect(options.providerId).toBe("neuralwatt");
	});
});
