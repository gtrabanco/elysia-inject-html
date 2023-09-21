export async function getPackageNameAndVersion() {
	const { name, version } = await import("../package.json");

	return { name, version };
}
