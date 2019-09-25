// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as compressing from 'compressing';
import * as https from 'https';
import * as path from 'path';
import * as url from 'url';
import * as vscode from 'vscode';
import * as fs from "fs";
function download(urlstring: string, stream: fs.WriteStream) {
	return new Promise((resolve, rejects) => {
		let urlload = url.parse(urlstring);
		stream.on('close', () => {
			resolve();
		});
		https.get(urlload, (res) => {
			if (res.statusCode === 302) {
				if (res.headers['location']) {
					download(res.headers['location'], stream);
				}
			} else if (res.statusCode === 200) {
				res.pipe(stream);
			} else {
				rejects(res.statusCode);
			}
		});
	});
}

function unzip(src: string, dir: string) {
	return new Promise((resolve, rejects) => {
		fs.stat(src, (err, stats) => {
			if (err) {
				rejects(err);
			}
			if (stats.isFile()) {
				compressing.zip.uncompress(src, dir).finally(() => {
					resolve();
				});
			} else {
				rejects(stats);
			}
		});
	});
}

function movefiles(srcdir: string, destdir: string) {
	return new Promise((resolve) => {
		let files = fs.readdirSync(srcdir, { withFileTypes: true });
		files.sort((n1, n2) => {
			if (n1.isFile() && n2.isDirectory()) {
				return -1;
			} else if (n1.isDirectory() && n2.isFile()) {
				return 1;
			} else {
				return 0;
			}
		});
		resolve(entrydir(files));
	});

	async function entrydir(files: fs.Dirent[]) {
		files.forEach(async element => {
			if (element.isDirectory()) {
				let childdir = path.resolve(srcdir, element.name);
				let newchilddir = path.resolve(destdir, element.name);
				fs.mkdir(newchilddir, err => { });
				await movefiles(childdir, newchilddir);
			}
			else {
				let srcfile = path.resolve(srcdir, element.name);
				let destfile = path.resolve(destdir, element.name);
				fs.copyFileSync(srcfile, destfile);
				fs.unlinkSync(srcfile);
			}
		});
		fs.rmdir(srcdir, err => { });
	}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('ESP-IDF engine is now active!');
	let activity_status = true;
	let engine_terminal = vscode.window.createTerminal("esp-engine");
	let zipfileurl = 'https://github.com/espressif/esp-idf-template/archive/master.zip';
	let zipfilename = 'master.zip';


	let IDF_PATH: string;
	if (process.platform === ("win32")) {
		IDF_PATH = "$env:IDF_PATH/tools/idf.py";
	} else {
		IDF_PATH = "$IDF_PATH/tools/idf.py";
	}
	// Initiate Command
	// Not completely implemented
	let initiate_command = vscode.commands.registerCommand('esp-engine.initiate', async function () {
		// Init Message
		vscode.window.showInformationMessage('Initiating Directory as ESP-IDF project ... It will take a few seconds.');
		console.log("running!");
		if (vscode.workspace.workspaceFolders) {
			let rootpath = path.normalize(vscode.workspace.workspaceFolders[0].uri.fsPath);
			let zipfliepath = path.resolve(rootpath, zipfilename);
			let allfilepath = path.resolve(rootpath, "esp-idf-template-master");
			let writer = fs.createWriteStream(zipfliepath);
			await download(zipfileurl, writer).catch(err => {
				console.log('download err');
				console.log(err);
			});
			await unzip(zipfliepath, rootpath).catch((err) => {
				console.log('unzip err');
				console.log(err);
			});
			await movefiles(allfilepath, rootpath).catch(err => {
				console.log('movefiles err');
				if (err.code !== 'EEXIST') {
					console.log(err);
				}
			});
			await fs.unlink(zipfliepath, err => {//delate the .zip file
				if (err) {
					console.log(err);
				}
			});
		} else {
			vscode.window.showInformationMessage('Please open a floader');
		}
		console.log("done!");
	});
	context.subscriptions.push(initiate_command);

	// Build Command
	let build_command = vscode.commands.registerCommand('esp-engine.build', function () {
		if (activity_status) {
			console.log("'CMakeLists.txt' file is present, initiating build.");
			// engine_terminal = vscode.window.createTerminal("esp-build");
			vscode.workspace.saveAll();
			engine_terminal.show();
			vscode.window.showInformationMessage("Project Compilation Initiated.");
			engine_terminal.sendText("python " + IDF_PATH + " build", true);
		}
	});
	context.subscriptions.push(build_command);

	// Menuconfig Command
	let menuconfig_command = vscode.commands.registerCommand('esp-engine.config', function () {
		if (activity_status) {
			// engine_terminal = vscode.window.createTerminal("esp-config");
			engine_terminal.show();
			vscode.window.showInformationMessage("Terminal size should be atleast 19 Lines by 80 Columns");
			engine_terminal.sendText("python " + IDF_PATH + " menuconfig", true);

		}
	});
	context.subscriptions.push(menuconfig_command);

	// Clean Command
	let clean_command = vscode.commands.registerCommand('esp-engine.clean', async function () {
		if (activity_status) {
			// engine_terminal = vscode.window.createTerminal("esp-clean");
			vscode.window.showInformationMessage("Cleaning built files.");
			await engine_terminal.sendText("python " + IDF_PATH + " clean", true);
			vscode.window.showInformationMessage("We've cleaned the built files.");
		}
	});
	context.subscriptions.push(clean_command);

	// Flash command
	let flash_command = vscode.commands.registerCommand('esp-engine.flash', async function () {
		if (activity_status) {
			// engine_terminal = vscode.window.createTerminal("esp-flash");
			vscode.window.showInformationMessage("Flashing Target");
			let baudrate = await vscode.window.showInputBox({
				prompt: "Specify Baudrate.",
				value: "115200"
			});
			let port = await vscode.window.showInputBox({
				prompt: "Specify Port Address.",
				value: "COM10"
			});
			await engine_terminal.show();
			await engine_terminal.sendText("python " + IDF_PATH + " -p " + port + " -b " + baudrate + " flash", true);
		}
	});
	context.subscriptions.push(flash_command);

	// Monitor command
	let monitor_command = vscode.commands.registerCommand('esp-engine.monitor', function () {
		if (activity_status) {
			// engine_terminal = vscode.window.createTerminal("esp-monitor");
			vscode.window.showInformationMessage("Opening Serial Monitor");
			engine_terminal.show();
			engine_terminal.sendText("python " + IDF_PATH + " monitor", true);
		}
	});
	context.subscriptions.push(monitor_command);
}
exports.activate = activate;


// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
};
