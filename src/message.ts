export default class Message {
  public id: string;
  public text: string;
  public team: string;
  public user: string;

  constructor(id: string, text: string, team: string, user: string) {
    this.id = id;
    this.text = text;
    this.team = team;
    this.user = user;
  }
}
