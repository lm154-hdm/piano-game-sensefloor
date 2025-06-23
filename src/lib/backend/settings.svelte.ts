import * as Fs from "@tauri-apps/plugin-fs";
import * as Path from "@tauri-apps/api/path";

const SETTINGS_VERSION: string = "1.1.0";

type Settings = {
    settingsVersion: string;
    speed: number;
    colorSchemeId: string;
    mode: Mode;
    midiConfig: MidiConfig;
    sensFloorConfig: SensFloorConfig;
};

type ColorScheme = {
    id: string;
    displayText: string;
};

type SensFloorConfig = {
    scaleX: number;
    scaleY: number;
    flipX: boolean;
    flipY: boolean;
    rotateBy: number;
    cropLeft: number;
    cropRight: number;
};

type MidiConfig = {
    path: string;
    trackIndex: number;
};

export enum Mode {
    Playback = 0,
    Pause = 1,
}

export const colorSchemes: ColorScheme[] = [
    {
        id: "default",
        displayText: "Berry",
    },
    {
        id: "blueYellow",
        displayText: "Beach",
    },
];

async function getSettingsPath(): Promise<string> {
    const dataPath = await Path.appLocalDataDir();
    return await Path.join(dataPath, "settings.json");
}

export async function load(): Promise<void> {
    const path = await getSettingsPath();

    if (await Fs.exists(path)) {
        const data = await Fs.readTextFile(path);
        const json = JSON.parse(data);

        if (json.settingsVersion == SETTINGS_VERSION) {
            settings.speed = json.speed;
            settings.colorSchemeId = json.colorSchemeId;
            settings.mode = json.mode;
            settings.midiConfig = json.midiConfig;
            settings.sensFloorConfig = json.sensFloorConfig;
        } else {
            console.error(
                "The version of your settings is different from the current applications settings version, reverting to default settings",
            );
        }

        // Apply loaded settings
        document.documentElement.setAttribute("data-colorscheme", settings.colorSchemeId);
        document.documentElement.style.setProperty("--crop-left", settings.sensFloorConfig.cropLeft + "px");
        document.documentElement.style.setProperty("--crop-right", settings.sensFloorConfig.cropRight + "px");
    } else {
        await save();
    }
}

export async function save(): Promise<void> {
    const path = await getSettingsPath();
    const content = JSON.stringify(settings, null, 2);
    await Fs.writeTextFile(path, content);
}

export const settings: Settings = $state({
    settingsVersion: SETTINGS_VERSION,
    midiFilePath: "AlleMeineEntchen.mid",
    speed: 100,
    mode: Mode.Pause,
    colorSchemeId: "default",
    midiConfig: {
        path: "",
        trackIndex: 0,
    },
    sensFloorConfig: {
        scaleX: 1,
        scaleY: 1,
        flipX: false,
        flipY: false,
        rotateBy: 0,
        cropLeft: 0,
        cropRight: 0,
    },
});
