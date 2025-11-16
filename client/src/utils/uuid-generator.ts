import { v4 as uuidv4 } from "uuid";

class Uuid {
  public GenerateUuid(): string {
    return uuidv4();
  }
}

export { Uuid };
