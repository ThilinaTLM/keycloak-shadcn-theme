import { useEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    headerNode,
    infoNode = null,
    children,
    documentTitle,
    bodyClassName,
    kcContext,
    i18n
  } = props;

  const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

  const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

  useEffect(() => {
    document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
  }, []);

  useSetClassName({
    qualifiedName: "body",
    className: bodyClassName ?? "bg-muted"
  });

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss: false });

  if (!isReadyToRender) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-6 sm:py-8 lg:py-12 px-2 sm:px-6 lg:px-8 bg-muted">
      <div className="w-full sm:mx-auto sm:max-w-md">
        <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground uppercase">
          <img
            src={`${import.meta.env.BASE_URL}${realm.name}.png`}
            width={500}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.removeAttribute("hidden");
            }}
          />
          <div hidden>{msg("loginTitleHtml", realm.displayNameHtml)}</div>
        </h2>
        {enabledLanguages.length > 1 && (
          <div className="mt-0 fixed right-5 top-5">
            <Select
              value={currentLanguage.languageTag}
              onValueChange={(value) => {
                const selected = enabledLanguages.find(({ languageTag }) => languageTag === value);
                if (!selected) return;
                window.location.href = selected.href;
              }}
            >
              <SelectTrigger className="min-w-[180px] bg-card">
                <SelectValue placeholder="Select a locale" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {enabledLanguages.map(({ languageTag, label }) => (
                    <SelectItem key={languageTag} value={languageTag}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-5 w-full sm:mx-auto sm:max-w-md">
        <div className="bg-card px-2 py-6 sm:px-6 sm:py-8 sm:shadow sm:rounded-lg md:shadow-md lg:shadow-lg flex flex-col items-center">
          <h1 className="text-xl sm:text-2xl font-normal text-foreground mb-4 sm:mb-6 text-center">{headerNode}</h1>
          {displayRequiredFields && (
            <div className="text-sm text-muted-foreground mb-4">
              <span className="text-destructive">*</span> {msg("requiredFields")}
            </div>
          )}
          {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
            <div
              className={`mb-4 p-2 sm:p-4 rounded-md ${message.type === "error" ? "bg-destructive/10 text-destructive" : message.type === "warning" ? "bg-warning/10 text-warning" : message.type === "info" ? "bg-info/10 text-info" : "bg-success/10 text-success"}`}
            >
              <div className="flex">
                <div className="shrink-0">
                  {message.type === "success" && (
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-success"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {message.type === "warning" && (
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-warning"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {message.type === "error" && (
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-destructive"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {message.type === "info" && (
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-info"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-2 sm:ml-3">
                  <h3 className="text-sm font-medium">
                    {message.type === "error" ? "Error" : message.type === "warning" ? "Warning" : message.type === "info" ? "Info" : "Success"}
                  </h3>
                  <div className="mt-2 text-sm" dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
                </div>
              </div>
            </div>
          )}
          {children}
          {auth !== undefined && auth.showTryAnotherWayLink && (
            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post" className="mt-4">
              <input type="hidden" name="tryAnotherWay" value="on" />
              <a
                href="#"
                id="try-another-way"
                onClick={() => {
                  document.forms["kc-select-try-another-way-form" as never].submit();
                  return false;
                }}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                {msg("doTryAnotherWay")}
              </a>
            </form>
          )}
          {displayInfo && <div className="mt-6 text-center">{infoNode}</div>}
        </div>
      </div>
    </div>
  );
}
