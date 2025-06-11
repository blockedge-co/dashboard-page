import { ErrorPage } from "../../../components/error-page"

export default function Error400() {
  return (
    <ErrorPage
      errorCode="400"
      title="Bad Request"
      description="The request could not be understood by the server due to malformed syntax."
      suggestion="Please check your request and try again."
    />
  )
}
