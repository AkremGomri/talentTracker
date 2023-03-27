import axios from "axios";

export async function getRoles(query) {
    const roles = await axios.get("/api/admin/roles", { params: { query } });
  }