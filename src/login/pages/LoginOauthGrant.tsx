import { PageProps } from "keycloakify/login/pages/PageProps";
import { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginOauthGrant(props: PageProps<Extract<KcContext, { pageId: "login-oauth-grant.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { url, oauth, client } = kcContext;
  const { msg, msgStr, advancedMsg, advancedMsgStr } = i18n;

  return (
    <Template
      {...props}
      bodyClassName="oauth"
      headerNode={
        <div className="text-center space-y-3">
          {client.attributes.logoUri && (
            <div className="flex justify-center">
              <img src={client.attributes.logoUri} alt={client.name || client.clientId} className="max-h-16" />
            </div>
          )}
          <p className="text-lg font-semibold">
            {client.name ? msg("oauthGrantTitle", advancedMsgStr(client.name)) : msg("oauthGrantTitle", client.clientId)}
          </p>
        </div>
      }
    >
      <div className="w-full max-w-md">
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">{msg("oauthGrantRequest")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {oauth.clientScopesRequested.map((clientScope) => (
                  <li key={clientScope.consentScreenText} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm text-foreground">
                      {advancedMsg(clientScope.consentScreenText)}
                      {clientScope.dynamicScopeParameter && (
                        <>
                          : <strong>{clientScope.dynamicScopeParameter}</strong>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {(client.attributes.policyUri || client.attributes.tosUri) && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-foreground mb-3">
                  {client.name ? msg("oauthGrantInformation", advancedMsgStr(client.name)) : msg("oauthGrantInformation", client.clientId)}
                </p>
                <div className="space-y-2 text-sm">
                  {client.attributes.tosUri && (
                    <div>
                      {msg("oauthGrantReview")}{" "}
                      <a href={client.attributes.tosUri} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80">
                        {msg("oauthGrantTos")}
                      </a>
                    </div>
                  )}
                  {client.attributes.policyUri && (
                    <div>
                      {msg("oauthGrantReview")}{" "}
                      <a href={client.attributes.policyUri} target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80">
                        {msg("oauthGrantPolicy")}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <form action={url.oauthAction} method="POST" className="space-y-4">
            <input type="hidden" name="code" value={oauth.code} />
            <div className="flex gap-4">
              <Button type="submit" name="accept" id="kc-login" className="flex-1">
                {msgStr("doYes")}
              </Button>
              <Button type="submit" name="cancel" id="kc-cancel" variant="outline" className="flex-1">
                {msgStr("doNo")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Template>
  );
}
