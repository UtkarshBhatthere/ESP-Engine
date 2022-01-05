# Archived ESP-Engine: Since official extension is available from ESP, this project is archived.

Addressing the aggressive use of terminal based commands required for working with ESP-IDF (and other variants such as ADF etc.) this extension is developed to create an command like interface (with Key-Binding support) to easen the development.

>NOTE: This extension in the curernt version does not include the toolchain or ESP-IDF component repository, future updates will resolve this too.

## Features

The ESP-Engine contains following Commands (Use CTRL+Shift+P to check key Bindings for your system) :

* `ESP-Engine.Initiate`: Convert current working directory to template IDF project.
* `ESP-Engine.Build`: Compile the whole project and generate Bin files for flashing.
* `ESP-Engine.Clean`: Clean built files.
* `ESP-Engine.Flash`: FLashes the built binaries to specified target device.
* `ESP-Engine.Monitor`: Serial Monitor for Debugging.
* `ESP-Engine.Menuconfig`: Project Configuration window.
* `ESP-Engine.Upcoming`: And many upcoming feautres in the pipeline.

## Requirements

You are required to have:

1. ESP-Toolchain : Refer ESP-IDF docs @ <https://docs.espressif.com/projects/esp-idf/en/stable/get-started-cmake/index.html>.
2. ESP-IDF       : Use git to clone ESP-IDF (preferrably stable version) using ->

```git
git clone -b v3.2.2 --recursive https://github.com/espressif/esp-idf.git
```

## Known Issues

No major known issues, kindly post issues you find at the github Repository.

### Beta Release v0.0.1

Initial release of ESP-Engine.
Contains all basic commands ESP-IDF development (namely Build, Flash, Clean, Monitor, Menuconfig).
Support automatic conversion of root folder to ESP-IDF Template.

-----------------------------------------------------------------------------------------------------------
