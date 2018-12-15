import { WhiteLight, RedLight, GreenLight, YellowLight, BlueLight, PinkLight } from "./light.mjs";

export class LightFactory {
    create(type) {
        let lights = {"white": WhiteLight, "red": RedLight, "green": GreenLight, "yellow": YellowLight, "blue": BlueLight, "pink": PinkLight};
        return new lights[type]();
    }
}