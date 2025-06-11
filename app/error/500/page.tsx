import { ErrorPage } from "../../../components/error-page"

export default function Error500() {
  return (
    <ErrorPage
      errorCode="500"
      title="Internal Server Error"
      description="The server encountered an unexpected condition that prevented it from fulfilling the request."
      suggestion="Please try again later or contact support if the problem persists."
    />
  )
}
