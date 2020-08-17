import Message from "./message";
import Config from "./config";

export default class State {
  /**
   * chat message hisotry.
   */
  public messagesO: Message[];
  public messagesX: Message[];
  public users: Map<string, string>;

  constructor() {
    this.messagesO = [];
    this.messagesX = [];
    this.users = new Map();
  }

  /**
   * addMessageO adds a new message to message history.
   */
  public addMessage(msg: Message) {
    if (!this.users.has(msg.id)) {
      console.log(`${msg.id}のユーザーは存在しない`);
    }
    const team = this.users.get(msg.id);
    if (team === "x") {
      this.messagesX.push(msg);
      if (this.messagesX.length > Config.messageHistoryLimit) {
        this.messagesX.shift();
      }
    } else {
      this.messagesO.push(msg);
      if (this.messagesO.length > Config.messageHistoryLimit) {
        this.messagesO.shift();
      }
    }
  }

  /**
   * gets chat messages in the team specified by id.
   * @param team teamId(o, x)
   */
  public getTeamMessages(team: string): Message[] {
    if (team === "x") {
      return this.messagesX;
    }
    return this.messagesO;
  }

  /**
   * adds a user to user list.
   * @param user userId
   * @param team teamId(o, x)
   */
  public addUser(user: string, team: string) {
    console.log(`user:${user} joins team:${team}`);
    this.users.set(user, team);
  }

  /**
   * removes a user from user list.
   * @param user userId
   */
  public removeUser(user: string) {
    this.users.delete(user);
  }
}
