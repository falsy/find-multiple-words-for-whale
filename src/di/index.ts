import repositories from "../adapters/repositories"
import infrastructures from "../adapters/infrastructures"
import Controller from "../adapters/controllers"

const infra = infrastructures()
const repo = repositories(infra)

export default new Controller(repo.whale, repo.storage)
