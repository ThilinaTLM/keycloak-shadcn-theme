import { Fragment } from "react";
import { useScript } from "keycloakify/login/pages/WebauthnAuthenticate.useScript";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Key } from "lucide-react";

export default function WebauthnAuthenticate(props: PageProps<Extract<KcContext, { pageId: "webauthn-authenticate.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { url, realm, registrationDisabled, authenticators, shouldDisplayAuthenticators } = kcContext;
  const { msg, msgStr, advancedMsg } = i18n;

  const authButtonId = "authenticateWebAuthnButton";

  useScript({
    authButtonId,
    kcContext,
    i18n
  });

  return (
    <Template
      {...props}
      displayInfo={realm.registrationAllowed && !registrationDisabled}
      infoNode={
        <span>
          {msg("noAccount")}{" "}
          <a tabIndex={6} href={url.registrationUrl} className="text-primary hover:underline">
            {msg("doRegister")}
          </a>
        </span>
      }
      headerNode={msg("webauthn-login-title")}
    >
      <div className="w-full max-w-md">
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          <form id="webauth" action={url.loginAction} method="post">
            <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
            <input type="hidden" id="authenticatorData" name="authenticatorData" />
            <input type="hidden" id="signature" name="signature" />
            <input type="hidden" id="credentialId" name="credentialId" />
            <input type="hidden" id="userHandle" name="userHandle" />
            <input type="hidden" id="error" name="error" />
          </form>

          {authenticators && (
            <>
              <form id="authn_select">
                {authenticators.authenticators.map((authenticator) => (
                  <input key={authenticator.credentialId} type="hidden" name="authn_use_chk" value={authenticator.credentialId} />
                ))}
              </form>

              {shouldDisplayAuthenticators && (
                <div className="space-y-4 mb-6">
                  {authenticators.authenticators.length > 1 && (
                    <p className="text-sm font-medium text-foreground">{msg("webauthn-available-authenticators")}</p>
                  )}
                  <div className="space-y-3">
                    {authenticators.authenticators.map((authenticator, i) => (
                      <Card key={i} id={`kc-webauthn-authenticator-item-${i}`}>
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10">
                            {authenticator.transports.iconClass ? (
                              <i className={`${authenticator.transports.iconClass} text-primary text-xl`} aria-hidden="true" />
                            ) : (
                              <Key className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div id={`kc-webauthn-authenticator-label-${i}`} className="font-medium text-foreground">
                              {advancedMsg(authenticator.label)}
                            </div>
                            {authenticator.transports.displayNameProperties?.length > 0 && (
                              <div id={`kc-webauthn-authenticator-transport-${i}`} className="text-sm text-muted-foreground">
                                {authenticator.transports.displayNameProperties
                                  .map((displayNameProperty, idx, arr) => ({
                                    displayNameProperty,
                                    hasNext: idx !== arr.length - 1
                                  }))
                                  .map(({ displayNameProperty, hasNext }) => (
                                    <Fragment key={displayNameProperty}>
                                      {advancedMsg(displayNameProperty)}
                                      {hasNext && <span>, </span>}
                                    </Fragment>
                                  ))}
                              </div>
                            )}
                            <div className="text-sm text-muted-foreground">
                              <span id={`kc-webauthn-authenticator-createdlabel-${i}`}>{msg("webauthn-createdAt-label")}</span>{" "}
                              <span id={`kc-webauthn-authenticator-created-${i}`}>{authenticator.createdAt}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <Button id={authButtonId} type="button" autoFocus className="w-full">
            {msgStr("webauthn-doAuthenticate")}
          </Button>
        </div>
      </div>
    </Template>
  );
}
