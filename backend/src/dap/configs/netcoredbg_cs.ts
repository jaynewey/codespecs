const config = {
	adapterCommand: `$PKG_DIR/netcoredbg/netcoredbg --server=5678 --interpreter=vscode -- $PKG_DIR/dotnet ${process.env.PWD}/bin/Debug/net5.0/program.dll`,
	codePath: `${process.env.PWD}/Program.cs`,
	language: "C# (.NET 5.0.201)",
};

export default config;
