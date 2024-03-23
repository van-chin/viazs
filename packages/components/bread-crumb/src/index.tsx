import { Breadcrumb, BreadcrumbItem } from "ant-design-vue";
import { VzNavMenu } from "../../nav-menu";
import { defineComponent } from "vue";

export default defineComponent({
  name: "BreadCrumb",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const siderMenuProps = {
      cachePrefix: "path-data-",
      children: "children",
      label: "name",
      value: "id",
      icon: "icon",
      leaf: "leaf",
      disabled: "disabled",
    };

    return () => (
      <Breadcrumb>
        {props.data.map((item: any) => {
          if (item.children.length) {
            return (
              <BreadcrumbItem
                overlay={<VzNavMenu data={item.children}></VzNavMenu>}
              >
                {item.name}
              </BreadcrumbItem>
            );
          } else {
            return <BreadcrumbItem>{item.name}</BreadcrumbItem>;
          }
        })}
      </Breadcrumb>
    );
  },
});
