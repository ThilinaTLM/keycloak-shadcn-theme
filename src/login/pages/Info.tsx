import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function Info(props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { advancedMsgStr, msg } = i18n;
  const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client } = kcContext;

  return (
    <Template
      {...props}
      displayMessage={false}
      headerNode={
        <span
          dangerouslySetInnerHTML={{
            __html: kcSanitize(messageHeader ?? message.summary)
          }}
        />
      }
    >
      <div className="w-full max-w-md">
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription
              className="space-y-4"
              dangerouslySetInnerHTML={{
                __html: kcSanitize(
                  (() => {
                    let html = message.summary;

                    if (requiredActions) {
                      html += " <strong class='font-medium'>";
                      html += requiredActions.map(requiredAction => advancedMsgStr(`requiredAction.${requiredAction}`)).join(", ");
                      html += "</strong>";
                    }

                    return html;
                  })()
                )
              }}
            />
          </Alert>

          {!skipLink && (
            <div className="mt-6 text-center">
              {pageRedirectUri && (
                <a href={pageRedirectUri} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {msg("backToApplication")}
                </a>
              )}
              {actionUri && (
                <a href={actionUri} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {msg("proceedWithAction")}
                </a>
              )}
              {client.baseUrl && !pageRedirectUri && !actionUri && (
                <a href={client.baseUrl} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {msg("backToApplication")}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Template>
  );
}
