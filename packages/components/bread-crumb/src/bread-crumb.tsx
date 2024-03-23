import { defineComponent } from "vue";
import { VzNavMenu } from "../../nav-menu";

export default defineComponent({
  name: "VzBreadCrumb",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const onClick = ({ key }) => {
      const realKey = key.split("-")[0];
      console.info("realKey =>", realKey);
      emit("click", realKey);
    };
    return () => (
      <VzNavMenu
        data={props.data}
        selectable={false}
        class="bread-crumb-menu"
        mode="horizontal"
        bread-crumb={true}
        triggerSubMenuAction="click"
      ></VzNavMenu>
    );
  },
});
