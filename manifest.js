const manifest = {
    version: process.env.npm_package_version,
    buildDate: new Date().toISOString(),
};

console.log(JSON.stringify(manifest));
