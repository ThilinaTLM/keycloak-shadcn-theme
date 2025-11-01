import React, { useEffect, useReducer, Fragment } from "react";
import { assert } from "keycloakify/tools/assert";
import {
  useUserProfileForm,
  getButtonToDisplayForMultivaluedAttributeField,
  type FormAction,
  type FormFieldError
} from "keycloakify/login/lib/useUserProfileForm";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { Attribute } from "keycloakify/login/KcContext";
import type { KcContext } from "./KcContext";
import type { I18n } from "./i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function UserProfileFormFields(props: UserProfileFormFieldsProps<KcContext, I18n>) {
  const { kcContext, i18n, onIsFormSubmittableValueChange, doMakeUserConfirmPassword, BeforeField, AfterField } = props;
  const { advancedMsg } = i18n;

  const {
    formState: { formFieldStates, isFormSubmittable },
    dispatchFormAction
  } = useUserProfileForm({
    kcContext,
    i18n,
    doMakeUserConfirmPassword
  });

  useEffect(() => {
    onIsFormSubmittableValueChange(isFormSubmittable);
  }, [isFormSubmittable]);

  const groupNameRef = { current: "" };

  return (
    <div className="space-y-4">
      {formFieldStates.map(({ attribute, displayableErrors, valueOrValues }) => (
        <Fragment key={attribute.name}>
          <GroupLabel attribute={attribute} groupNameRef={groupNameRef} i18n={i18n} />
          {BeforeField && (
            <BeforeField
              attribute={attribute}
              dispatchFormAction={dispatchFormAction}
              displayableErrors={displayableErrors}
              valueOrValues={valueOrValues}
              i18n={i18n}
              kcClsx={() => ""}
            />
          )}
          <div
            className="space-y-2"
            style={{
              display: attribute.name === "password-confirm" && !doMakeUserConfirmPassword ? "none" : undefined
            }}
          >
            <div className="space-y-1">
              <Label htmlFor={attribute.name} className="text-sm font-medium text-foreground">
                {advancedMsg(attribute.displayName ?? "")}
                {attribute.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              <div className="space-y-2">
                {attribute.annotations.inputHelperTextBefore && (
                  <p className="text-sm text-muted-foreground" id={`form-help-text-before-${attribute.name}`}>
                    {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                  </p>
                )}

                <InputFieldByType
                  attribute={attribute}
                  valueOrValues={valueOrValues}
                  displayableErrors={displayableErrors}
                  dispatchFormAction={dispatchFormAction}
                  i18n={i18n}
                />

                <FieldErrors attribute={attribute} displayableErrors={displayableErrors} fieldIndex={undefined} />

                {attribute.annotations.inputHelperTextAfter && (
                  <p className="text-sm text-muted-foreground" id={`form-help-text-after-${attribute.name}`}>
                    {advancedMsg(attribute.annotations.inputHelperTextAfter)}
                  </p>
                )}

                {AfterField && (
                  <AfterField
                    attribute={attribute}
                    dispatchFormAction={dispatchFormAction}
                    displayableErrors={displayableErrors}
                    valueOrValues={valueOrValues}
                    i18n={i18n}
                    kcClsx={() => ""}
                  />
                )}
              </div>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function GroupLabel(props: { attribute: Attribute; groupNameRef: { current: string }; i18n: I18n }) {
  const { attribute, groupNameRef, i18n } = props;
  const { advancedMsg } = i18n;

  if (attribute.group?.name !== groupNameRef.current) {
    groupNameRef.current = attribute.group?.name ?? "";

    if (groupNameRef.current !== "") {
      assert(attribute.group !== undefined);

      return (
        <div
          className="mb-6"
          {...Object.fromEntries(Object.entries(attribute.group.html5DataAnnotations).map(([key, value]) => [`data-${key}`, value]))}
        >
          {(() => {
            const groupDisplayHeader = attribute.group.displayHeader ?? "";
            const groupHeaderText = groupDisplayHeader !== "" ? advancedMsg(groupDisplayHeader) : attribute.group.name;

            return (
              <div className="mb-2">
                <h2 id={`header-${attribute.group.name}`} className="text-lg font-semibold text-foreground">
                  {groupHeaderText}
                </h2>
              </div>
            );
          })()}
          {(() => {
            const groupDisplayDescription = attribute.group.displayDescription ?? "";

            if (groupDisplayDescription !== "") {
              const groupDescriptionText = advancedMsg(groupDisplayDescription);

              return (
                <p id={`description-${attribute.group.name}`} className="text-sm text-muted-foreground">
                  {groupDescriptionText}
                </p>
              );
            }

            return null;
          })()}
        </div>
      );
    }
  }

  return null;
}

type InputFieldByTypeProps = {
  attribute: Attribute;
  valueOrValues: string | string[];
  displayableErrors: FormFieldError[];
  dispatchFormAction: React.Dispatch<FormAction>;
  i18n: I18n;
};

function InputFieldByType(props: InputFieldByTypeProps) {
  const { attribute, valueOrValues } = props;

  switch (attribute.annotations.inputType) {
    case "textarea":
      return <TextareaTag {...props} />;
    case "select":
    case "multiselect":
      return <SelectTag {...props} />;
    case "select-radiobuttons":
    case "multiselect-checkboxes":
      return <InputTagSelects {...props} />;
    default: {
      if (valueOrValues instanceof Array) {
        return (
          <div className="space-y-2">
            {valueOrValues.map((_, i) => (
              <InputTag key={i} {...props} fieldIndex={i} />
            ))}
          </div>
        );
      }

      const inputNode = <InputTag {...props} fieldIndex={undefined} />;

      if (attribute.name === "password" || attribute.name === "password-confirm") {
        return (
          <PasswordWrapper i18n={props.i18n} passwordInputId={attribute.name}>
            {inputNode}
          </PasswordWrapper>
        );
      }

      return inputNode;
    }
  }
}

function PasswordWrapper(props: { i18n: I18n; passwordInputId: string; children: JSX.Element }) {
  const { i18n, passwordInputId, children } = props;
  const { msgStr } = i18n;
  const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((state: boolean) => !state, false);

  useEffect(() => {
    const passwordInputElement = document.getElementById(passwordInputId);
    assert(passwordInputElement instanceof HTMLInputElement);
    passwordInputElement.type = isPasswordRevealed ? "text" : "password";
  }, [isPasswordRevealed]);

  return (
    <div className="relative">
      {children}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
        onClick={toggleIsPasswordRevealed}
        aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
        aria-controls={passwordInputId}
      >
        {isPasswordRevealed ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
      </Button>
    </div>
  );
}

function InputTag(props: InputFieldByTypeProps & { fieldIndex: number | undefined }) {
  const { attribute, fieldIndex, dispatchFormAction, valueOrValues, i18n, displayableErrors } = props;
  const { advancedMsgStr } = i18n;

  return (
    <div className="space-y-2">
      <Input
        type={(() => {
          const { inputType } = attribute.annotations;
          if (inputType?.startsWith("html5-")) {
            return inputType.slice(6);
          }
          return inputType ?? "text";
        })()}
        id={attribute.name}
        name={attribute.name}
        value={(() => {
          if (fieldIndex !== undefined) {
            assert(valueOrValues instanceof Array);
            return valueOrValues[fieldIndex];
          }
          assert(typeof valueOrValues === "string");
          return valueOrValues;
        })()}
        className="h-10"
        aria-invalid={displayableErrors.find((error) => error.fieldIndex === fieldIndex) !== undefined}
        disabled={attribute.readOnly}
        autoComplete={attribute.autocomplete}
        placeholder={
          attribute.annotations.inputTypePlaceholder === undefined ? undefined : advancedMsgStr(attribute.annotations.inputTypePlaceholder)
        }
        {...(attribute.annotations.inputTypePattern && { pattern: attribute.annotations.inputTypePattern })}
        {...(attribute.annotations.inputTypeSize && {
          size: parseInt(`${attribute.annotations.inputTypeSize}`)
        })}
        {...(attribute.annotations.inputTypeMaxlength && {
          maxLength: parseInt(`${attribute.annotations.inputTypeMaxlength}`)
        })}
        {...(attribute.annotations.inputTypeMinlength && {
          minLength: parseInt(`${attribute.annotations.inputTypeMinlength}`)
        })}
        {...(attribute.annotations.inputTypeMax && { max: attribute.annotations.inputTypeMax })}
        {...(attribute.annotations.inputTypeMin && { min: attribute.annotations.inputTypeMin })}
        {...(attribute.annotations.inputTypeStep && { step: attribute.annotations.inputTypeStep })}
        {...Object.fromEntries(Object.entries(attribute.html5DataAnnotations ?? {}).map(([key, value]) => [`data-${key}`, value]))}
        onChange={(event) => {
          dispatchFormAction({
            action: "update",
            name: attribute.name,
            valueOrValues:
              fieldIndex !== undefined
                ? (valueOrValues as string[]).map((value, i) => (i === fieldIndex ? event.target.value : value))
                : event.target.value
          });
        }}
        onBlur={() =>
          dispatchFormAction({
            action: "focus lost",
            name: attribute.name,
            fieldIndex: fieldIndex
          })
        }
      />
      {fieldIndex !== undefined && (
        <>
          <FieldErrors attribute={attribute} displayableErrors={displayableErrors} fieldIndex={fieldIndex} />
          <AddRemoveButtonsMultiValuedAttribute
            attribute={attribute}
            values={valueOrValues as string[]}
            fieldIndex={fieldIndex}
            dispatchFormAction={dispatchFormAction}
            i18n={i18n}
          />
        </>
      )}
    </div>
  );
}

function TextareaTag(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, displayableErrors, valueOrValues } = props;
  assert(typeof valueOrValues === "string");

  return (
    <Textarea
      id={attribute.name}
      name={attribute.name}
      className="min-h-[100px] resize-y"
      aria-invalid={displayableErrors.length !== 0}
      disabled={attribute.readOnly}
      {...(attribute.annotations.inputTypeCols && {
        cols: parseInt(`${attribute.annotations.inputTypeCols}`)
      })}
      {...(attribute.annotations.inputTypeRows && {
        rows: parseInt(`${attribute.annotations.inputTypeRows}`)
      })}
      {...(attribute.annotations.inputTypeMaxlength && {
        maxLength: parseInt(`${attribute.annotations.inputTypeMaxlength}`)
      })}
      value={valueOrValues}
      onChange={(event) =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: event.target.value
        })
      }
      onBlur={() =>
        dispatchFormAction({
          action: "focus lost",
          name: attribute.name,
          fieldIndex: undefined
        })
      }
    />
  );
}

function SelectTag(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, displayableErrors, i18n, valueOrValues } = props;
  const isMultiple = attribute.annotations.inputType === "multiselect";
  const options = getOptions(attribute);

  return (
    <Select
      value={isMultiple ? undefined : (valueOrValues as string) === "" ? "__placeholder__" : (valueOrValues as string)}
      onValueChange={(value) =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: value === "__placeholder__" ? "" : value
        })
      }
    >
      <SelectTrigger className="h-10" aria-invalid={displayableErrors.length !== 0}>
        <SelectValue placeholder=" " />
      </SelectTrigger>
      <SelectContent>
        {!isMultiple && <SelectItem value="__placeholder__">Select...</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {inputLabel(i18n, attribute, option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function InputTagSelects(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, i18n, valueOrValues, displayableErrors } = props;
  const { inputType } = attribute.annotations;

  assert(inputType === "select-radiobuttons" || inputType === "multiselect-checkboxes");

  const options = getOptions(attribute);

  if (inputType === "select-radiobuttons") {
    return (
      <RadioGroup
        className="space-y-3"
        value={valueOrValues as string}
        onValueChange={(value) =>
          dispatchFormAction({
            action: "update",
            name: attribute.name,
            valueOrValues: value
          })
        }
        aria-invalid={displayableErrors.length !== 0}
        disabled={attribute.readOnly}
      >
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${attribute.name}-${option}`} />
            <Label htmlFor={`${attribute.name}-${option}`} className={`text-sm ${attribute.readOnly ? "text-muted-foreground" : "text-foreground"}`}>
              {inputLabel(i18n, attribute, option)}
            </Label>
          </div>
        ))}
      </RadioGroup>
    );
  }

  // multiselect-checkboxes
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`${attribute.name}-${option}`}
            name={attribute.name}
            value={option}
            checked={valueOrValues instanceof Array ? valueOrValues.includes(option) : valueOrValues === option}
            disabled={attribute.readOnly}
            aria-invalid={displayableErrors.length !== 0}
            onCheckedChange={(checked) => {
              dispatchFormAction({
                action: "update",
                name: attribute.name,
                valueOrValues:
                  valueOrValues instanceof Array
                    ? checked
                      ? [...valueOrValues, option]
                      : valueOrValues.filter((v) => v !== option)
                    : checked
                      ? option
                      : ""
              });
            }}
            onBlur={() =>
              dispatchFormAction({
                action: "focus lost",
                name: attribute.name,
                fieldIndex: undefined
              })
            }
          />
          <Label htmlFor={`${attribute.name}-${option}`} className={`text-sm ${attribute.readOnly ? "text-muted-foreground" : "text-foreground"}`}>
            {inputLabel(i18n, attribute, option)}
          </Label>
        </div>
      ))}
    </div>
  );
}

function FieldErrors(props: { attribute: Attribute; displayableErrors: FormFieldError[]; fieldIndex: number | undefined }) {
  const { attribute, fieldIndex } = props;
  const displayableErrors = props.displayableErrors.filter((error) => error.fieldIndex === fieldIndex);

  if (displayableErrors.length === 0) {
    return null;
  }

  return (
    <div className="text-xs text-destructive">
      <div id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`} aria-live="polite">
        {displayableErrors.map(({ errorMessage }, i) => (
          <Fragment key={i}>
            {errorMessage}
            {i < displayableErrors.length - 1 && <br />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function AddRemoveButtonsMultiValuedAttribute(props: {
  attribute: Attribute;
  values: string[];
  fieldIndex: number;
  dispatchFormAction: React.Dispatch<Extract<FormAction, { action: "update" }>>;
  i18n: I18n;
}) {
  const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props;
  const { msg } = i18n;

  const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({
    attribute,
    values,
    fieldIndex
  });

  const idPostfix = `-${attribute.name}-${fieldIndex + 1}`;

  return (
    <div className="flex items-center gap-2 mt-2">
      {hasRemove && (
        <Button
          id={`kc-remove${idPostfix}`}
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: values.filter((_, i) => i !== fieldIndex)
            })
          }
        >
          {msg("remove")}
        </Button>
      )}
      {hasAdd && (
        <Button
          id={`kc-add${idPostfix}`}
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: [...values, ""]
            })
          }
        >
          {msg("addValue")}
        </Button>
      )}
    </div>
  );
}

function getOptions(attribute: Attribute): string[] {
  walk: {
    const { inputOptionsFromValidation } = attribute.annotations;

    if (inputOptionsFromValidation === undefined) {
      break walk;
    }

    assert(typeof inputOptionsFromValidation === "string");

    const validator = (attribute.validators as Record<string, { options?: string[] }>)[inputOptionsFromValidation];

    if (validator === undefined) {
      break walk;
    }

    if (validator.options === undefined) {
      break walk;
    }

    return validator.options;
  }

  return attribute.validators.options?.options ?? [];
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string): string | JSX.Element {
  const { advancedMsg } = i18n;

  if (attribute.annotations.inputOptionLabels !== undefined) {
    const { inputOptionLabels } = attribute.annotations;
    return advancedMsg(inputOptionLabels[option] ?? option);
  }

  if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
    return advancedMsg(`${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`);
  }

  return option;
}
