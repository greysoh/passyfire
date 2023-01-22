export async function get(url, opts) {
  try {
    const data = await axios.get(url, opts);
    return data;
  } catch (e) {
    return e;
  }
}

export async function post(url, opts) {
  try {
    const data = await axios.post(url, opts);
    return data;
  } catch (e) {
    return e;
  }
}