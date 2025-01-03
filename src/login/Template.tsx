import { useEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button.tsx";
import { ChevronLeft } from "lucide-react";

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
    className: bodyClassName ?? "bg-gray-100"
  });

  const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss: false });

  if (!isReadyToRender) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-4xl font-extrabold text-gray-900 uppercase">{msg("loginTitleHtml", realm.displayNameHtml)}</h2>
        {enabledLanguages.length > 1 && (
          <div className="fixed right-5 top-5">
            <Select
              value={currentLanguage.languageTag}
              onValueChange={value => {
                const selected = enabledLanguages.find(({ languageTag }) => languageTag === value);
                if (!selected) return;
                window.location.href = selected.href;
              }}
            >
              <SelectTrigger className="w-[180px] bg-white">
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
        <div className="fixed left-5 top-5">
          <Button
            variant="ghost"
            onClick={() => {
              window.history.back();
            }}
            className="p-0 h-fit w-fit transition-all duration-200 hover:scale-110 hover:-translate-x-1"
          >
            <ChevronLeft style={{ width: "27px", height: "27px" }} />
          </Button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-6">
          <h1 className="text-2xl font-normal text-gray-900 mb-6 text-center">{headerNode}</h1>
          {displayRequiredFields && (
            <div className="text-sm text-gray-500 mb-4">
              <span className="text-red-500">*</span> {msg("requiredFields")}
            </div>
          )}
          {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
            <div
              className={`mb-4 p-4 rounded-md ${message.type === "error" ? "bg-red-50 text-red-700" : message.type === "warning" ? "bg-yellow-50 text-yellow-700" : message.type === "info" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {message.type === "success" && (
                    <svg
                      className="h-5 w-5 text-green-400"
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
                      className="h-5 w-5 text-yellow-400"
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
                      className="h-5 w-5 text-red-400"
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
                      className="h-5 w-5 text-blue-400"
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
                <div className="ml-3">
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
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
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
