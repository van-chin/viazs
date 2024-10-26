import { withInstall } from "@viaz/utils";

import DesignerCustomizationProp from "./customization-prop.vue";

import DesignerCustomizationObject from "./customization-object.vue";

import DesignerCustomizationPropHeader from "./customization-prop-header.vue";

const VzDesignerCustomizationProp = withInstall(DesignerCustomizationProp);

const VzDesignerCustomizationObject = withInstall(DesignerCustomizationObject);

const VzDesignerCustomizationPropHeader = withInstall(
  DesignerCustomizationPropHeader
);

export {
  VzDesignerCustomizationPropHeader,
  VzDesignerCustomizationProp,
  VzDesignerCustomizationObject,
};
