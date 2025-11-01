import { useEffect } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, TriangleAlert, XCircle, Info } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Template(props: TemplateProps<KcContext, I18n>) {
  const {
    displayInfo = false,
    displayMessage = true,
    displayRequiredFields = false,
    headerNode,
    infoNode = null,
    socialProvidersNode = null,
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
      {/* Theme Toggle - Top Left */}
      <div className="fixed left-5 top-5 z-50">
        <ModeToggle />
      </div>
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
                  {message.type === "success" && <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-success" />}
                  {message.type === "warning" && <TriangleAlert className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />}
                  {message.type === "error" && <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />}
                  {message.type === "info" && <Info className="h-4 w-4 sm:h-5 sm:w-5 text-info" />}
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
          {socialProvidersNode}
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
