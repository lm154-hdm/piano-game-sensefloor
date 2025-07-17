import * as Path from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/core";

declare const __APP_VERSION__: string;

interface Settings {
    settingsVersion: string;
    speed: number;
    buffer: number;
    colorSchemeId: string;
    mode: Mode;
    midiConfig: MidiConfig;
}

interface ColorScheme {
    id: string;
    displayText: string;
}

interface MidiConfig {
    path: string;
    trackIndex: number;
}

export enum Mode {
    Normal = 0,
    Pause = 1,
    Playback = 2,
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
    console.log("Loading settings");

    const path = await getSettingsPath();
    const doesFileExist = await invoke<boolean>("does_file_exist", { path });

    if (doesFileExist) {
        const data = await invoke<string>("read_text_file", { path });
        const json = JSON.parse(data);

        if (json.settingsVersion == __APP_VERSION__) {
            settings.speed = json.speed;
            settings.colorSchemeId = json.colorSchemeId;
            settings.mode = json.mode;
            settings.midiConfig = json.midiConfig;
        } else {
            console.warn(
                "The version of your settings is different from the current applications settings version, reverting to default settings",
            );
        }

        // Apply loaded settings
        document.documentElement.setAttribute("data-colorscheme", settings.colorSchemeId);
    } else {
        await save();
    }
}

export async function save(): Promise<void> {
    console.log("Saving settings");

    const path = await getSettingsPath();
    const content = JSON.stringify(settings, null, 2);
    await invoke("write_text_file", { path, content });
}

export const settings: Settings = $state({
    settingsVersion: __APP_VERSION__,
    speed: 100,
    buffer: 0.1,
    mode: Mode.Pause,
    colorSchemeId: "default",
    midiConfig: {
        path: "",
        trackIndex: 0,
    },
});
