// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('ESP-IDF engine is now active!');
	let activity_status = true;
	let engine_terminal; // For unified terminal experience.
	let template_uri = "'https://github.com/espressif/esp-idf-template/archive/master.zip'";
	let template_location = '$loc\\esp-engine\\template.zip';

	// Initiate Command
	// Not completely implemented
	let initiate_command = vscode.commands.registerCommand('esp-engine.initiate', function (){
		vscode.window.showInformationMessage('Initiating Directory as ESP-IDF project ...');
		engine_terminal = vscode.window.createTerminal('esp-Init');
		if(vscode.workspace.findFiles('CMakeLists.txt')){
			// engine_terminal.sendText('$loc = Get-location', true);
			// engine_terminal.sendText('Remove-Item $loc/* -Force -Recurse', true);
			engine_terminal.sendText('mkdir /esp-engine/', true);
			engine_terminal.sendText('Invoke-WebRequest -Uri ' + template_uri + " -Outfile " + template_location, true);
			engine_terminal.sendText('Expand-Archive ' + template_location + " $loc\\esp-engine\\temp\\", true);
			engine_terminal.sendText('mv ' + " $loc\\esp-engine\\temp\\esp-idf-template-master\\* $loc\\", true);
			engine_terminal.sendText('Remove-Item $loc\\esp-engine\\ -Force -Recurse', true);
			vscode.window.showInformationMessage("Done.");
		}else{
			vscode.window.showInformationMessage("Not an Empty Folder!");
		}
	});
	context.subscriptions.push(initiate_command);

	// Build Command
	let build_command = vscode.commands.registerCommand('esp-engine.build', function(){
		if(activity_status){
			console.log("'CMakeLists.txt' file is present, initiating build.");
			engine_terminal = vscode.window.createTerminal("esp-build");
			vscode.workspace.saveAll();
			vscode.window.showInformationMessage("Project Compilation Initiated.");
			engine_terminal.sendText("python $env:IDF_PATH/tools/idf.py build", true);
			engine_terminal.show();
		}
	});
	context.subscriptions.push(build_command);

	// Menuconfig Command
	let menuconfig_command = vscode.commands.registerCommand('esp-engine.configure', function(){
		if(activity_status){
			engine_terminal = vscode.window.createTerminal("esp-config");
			vscode.window.showInformationMessage("Terminal size should be atleast 19 Lines by 80 Columns");
			engine_terminal.show();
			engine_terminal.sendText("python $env:IDF_PATH/tools/idf.py menuconfig", true);
		}
	});
	context.subscriptions.push(menuconfig_command);

	// Clean Command
	let clean_command = vscode.commands.registerCommand('esp-engine.clean', function(){
		if(activity_status){
			engine_terminal = vscode.window.createTerminal("esp-clean");
			vscode.window.showInformationMessage("Cleaning built files.");
			engine_terminal.sendText("python $env:IDF_PATH/tools/idf.py clean", true);
			engine_terminal.dispose();
			vscode.window.showInformationMessage("We've cleaned the built files.s");
		}
	});
	context.subscriptions.push(clean_command);

	// Flash command
	let flash_command = vscode.commands.registerCommand('esp-engine.flash', function(){
		if(activity_status){
			engine_terminal = vscode.window.createTerminal("esp-flash");
			vscode.window.showInformationMessage("Flashing Target", );
			engine_terminal.show();
			engine_terminal.sendText("python $env:IDF_PATH/tools/idf.py flash", true);
		}
	});
	context.subscriptions.push(flash_command);

	// Monitor command
	let monitor_command = vscode.commands.registerCommand('esp-engine.monitor', function(){
		if(activity_status){
			engine_terminal = vscode.window.createTerminal("esp-monitor");
			vscode.window.showInformationMessage("Opening Serial Monitor");
			engine_terminal.show();
			engine_terminal.sendText("python $env:IDF_PATH/tools/idf.py monitor", true);
		}
	});
	context.subscriptions.push(monitor_command);

	// Setup Command
	// let setup_command = vscode.commands.registerCommand('esp-engine.monitor', function(){
	// 	if(activity_status){
	// 		engine_terminal = vscode.window.createTerminal("esp-monitor");
	// 		vscode.window.showInformationMessage("Opening Serial Monitor");
	// 		engine_terminal.show();
	// 		engine_terminal.sendText("python $env:IDF_PATH/tools/idf.py monitor", true);
	// 	}
	// });
	// context.subscriptions.push(setup_command);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
};
