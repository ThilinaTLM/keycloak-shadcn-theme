import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircleX } from "lucide-react";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { message, client, skipLink } = kcContext;
  const { msg } = i18n;

  return (
    <Template {...props} displayMessage={false} headerNode={msg("errorTitle")}>
      <div className="w-full max-w-md">
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          <Alert variant="destructive">
            <CircleX className="h-4 w-4" />
            <AlertDescription
              dangerouslySetInnerHTML={{
                __html: kcSanitize(message.summary)
              }}
            />
          </Alert>
          {!skipLink && client?.baseUrl && (
            <div className="mt-6 text-center">
              <a id="backToApplication" href={client.baseUrl} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                {msg("backToApplication")}
              </a>
            </div>
          )}
        </div>
      </div>
    </Template>
  );
}
