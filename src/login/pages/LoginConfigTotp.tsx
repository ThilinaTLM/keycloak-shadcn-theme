import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginConfigTotp(props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>) {
  const { kcContext, i18n, Template } = props;
  const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;
  const { msg, msgStr, advancedMsg } = i18n;

  return (
    <Template {...props} headerNode={msg("loginTotpTitle")} displayMessage={!messagesPerField.existsError("totp", "userLabel")}>
      <div className="w-full max-w-md">
        <div className="py-2 px-4 sm:rounded-lg sm:px-6">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <ol className="space-y-6 list-decimal list-inside">
                <li className="space-y-2">
                  <p className="text-sm font-medium text-foreground">{msg("loginTotpStep1")}</p>
                  <ul className="ml-6 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                    {totp.supportedApplications.map((app) => (
                      <li key={app}>{advancedMsg(app)}</li>
                    ))}
                  </ul>
                </li>

                {mode === "manual" ? (
                  <>
                    <li className="space-y-2">
                      <p className="text-sm font-medium text-foreground">{msg("loginTotpManualStep2")}</p>
                      <div className="bg-muted p-3 rounded-md">
                        <code className="text-sm font-mono break-all">{totp.totpSecretEncoded}</code>
                      </div>
                      <a href={totp.qrUrl} className="text-sm font-medium text-primary hover:text-primary/80">
                        {msg("loginTotpScanBarcode")}
                      </a>
                    </li>
                    <li className="space-y-2">
                      <p className="text-sm font-medium text-foreground">{msg("loginTotpManualStep3")}</p>
                      <ul className="ml-6 space-y-1 text-sm text-muted-foreground">
                        <li>
                          {msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)}
                        </li>
                        <li>
                          {msg("loginTotpAlgorithm")}: {totp.policy.getAlgorithmKey()}
                        </li>
                        <li>
                          {msg("loginTotpDigits")}: {totp.policy.digits}
                        </li>
                        {totp.policy.type === "totp" ? (
                          <li>
                            {msg("loginTotpInterval")}: {totp.policy.period}
                          </li>
                        ) : (
                          <li>
                            {msg("loginTotpCounter")}: {totp.policy.initialCounter}
                          </li>
                        )}
                      </ul>
                    </li>
                  </>
                ) : (
                  <li className="space-y-3">
                    <p className="text-sm font-medium text-foreground">{msg("loginTotpStep2")}</p>
                    <div className="flex justify-center bg-white p-4 rounded-md border">
                      <img
                        id="kc-totp-secret-qr-code"
                        src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
                        alt="QR Code for TOTP setup"
                        className="max-w-full h-auto"
                      />
                    </div>
                    <a href={totp.manualUrl} className="text-sm font-medium text-primary hover:text-primary/80">
                      {msg("loginTotpUnableToScan")}
                    </a>
                  </li>
                )}

                <li className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{msg("loginTotpStep3")}</p>
                  <p className="text-sm text-muted-foreground">{msg("loginTotpStep3DeviceName")}</p>
                </li>
              </ol>
            </CardContent>
          </Card>

          <form action={url.loginAction} id="kc-totp-settings-form" method="post" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="totp" className="text-sm font-medium text-foreground">
                {msg("authenticatorCode")} <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                id="totp"
                name="totp"
                autoComplete="off"
                className="h-10"
                aria-invalid={messagesPerField.existsError("totp")}
              />
              {messagesPerField.existsError("totp") && (
                <Alert variant="destructive">
                  <AlertDescription
                    id="input-error-otp-code"
                    aria-live="polite"
                    dangerouslySetInnerHTML={{
                      __html: kcSanitize(messagesPerField.get("totp"))
                    }}
                  />
                </Alert>
              )}
            </div>

            <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
            {mode && <input type="hidden" id="mode" value={mode} />}

            <div className="space-y-2">
              <Label htmlFor="userLabel" className="text-sm font-medium text-foreground">
                {msg("loginTotpDeviceName")} {totp.otpCredentials.length >= 1 && <span className="text-destructive">*</span>}
              </Label>
              <Input
                type="text"
                id="userLabel"
                name="userLabel"
                autoComplete="off"
                className="h-10"
                aria-invalid={messagesPerField.existsError("userLabel")}
              />
              {messagesPerField.existsError("userLabel") && (
                <Alert variant="destructive">
                  <AlertDescription
                    id="input-error-otp-label"
                    aria-live="polite"
                    dangerouslySetInnerHTML={{
                      __html: kcSanitize(messagesPerField.get("userLabel"))
                    }}
                  />
                </Alert>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="logout-sessions" name="logout-sessions" value="on" defaultChecked={true} />
              <Label htmlFor="logout-sessions" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {msg("logoutOtherSessions")}
              </Label>
            </div>

            <div className="flex gap-4">
              {isAppInitiatedAction ? (
                <>
                  <Button type="submit" id="saveTOTPBtn" className="flex-1">
                    {msgStr("doSubmit")}
                  </Button>
                  <Button type="submit" name="cancel-aia" value="true" variant="outline" id="cancelTOTPBtn" className="flex-1">
                    {msg("doCancel")}
                  </Button>
                </>
              ) : (
                <Button type="submit" id="saveTOTPBtn" className="w-full">
                  {msgStr("doSubmit")}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Template>
  );
}
