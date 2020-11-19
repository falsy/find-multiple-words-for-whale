import repositories from "../repositories"
import infrastructures from "../infrastructures"

const infra = infrastructures()
const repo = repositories(infra)

export default repo;