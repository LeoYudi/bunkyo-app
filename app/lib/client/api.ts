type BaseRequestArgs = {
  path: string;
};

type RequestWithBodyArgs = {
  body?: BodyInit | null;
} & BaseRequestArgs;

export class LocalAPI {
  static #defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  static async get({ path }: BaseRequestArgs) {
    const response = await fetch(path, { headers: this.#defaultHeaders });
    return response.json();
  }

  static async post({ path, body }: RequestWithBodyArgs) {
    const response = await fetch(path, {
      headers: this.#defaultHeaders,
      method: 'POST',
      body,
    });

    return response.json();
  }
}
