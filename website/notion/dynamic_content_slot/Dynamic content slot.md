# Dynamic content slot

Created by: Erez Reznikov
Created time: August 20, 2024 12:41 PM
Collection: Designers
Owner: Erez Reznikov
Parent doc: Elements (https://www.notion.so/Elements-0a999b2acddd461e931cb346a0143dd2?pvs=21)
Status: Release ready

Dynamic content slot (in short DCS) is a special div that - when placed inside a component - allows adding and removing objects in any of the components instances.

![Screenshot 2024-09-23 at 15.41.37.png](Dynamic%20content%20slot%20328661e9d9fb49ce924fddcdb1ecc777/placeholder.png)

The DCS is the only ability that allows adding or removing nested objects into another instance and will allow users to populate lists items, tabs items, cards, menu items for example inside instances of components like lists, tabs navigation panels and menus, and many more.

### DCS key rules

1. Cannot be made into a source component by itself, only inserted into one.
2. Can be styled using the DDP in the same way that a div can be
3. These objects don't have any props
4. The DCS can be dragged into all elements that allow dragging objects into them.

### How to add a DCS to a component?

To add the dynamic content slot you need to click on the navigation icon button […]

![Screenshot 2024-09-23 at 15.50.11.png](Dynamic%20content%20slot%20328661e9d9fb49ce924fddcdb1ecc777/dynamic_content_slot_guidelines.png)

DCS’s are represented as layers as well, and can be dragged around and inside regular divs and elements. They can and should be renamed meaningfully. No two dynamic slots can have the same name, so if you don’t change the name of the layer and create another one - Jux will add a suffix to the layer name like: ‘dynamic content 2’.

### Non trivial nesting mechanic logic

In order to be able to add and remove objects from a nested instance’s dynamic content slot - you should place the instance inside a dynamic content slot in the main component.

To make it concrete: In this example the only reason ‘left content’ DCS can be accessed is because the footer instance is placed inside of ‘footer_wrapper’ DCS. If the footer instance was just placed after ‘body’ a user wouldn’t be able to access it from an instance of the modal.

![linking_content.png](Dynamic%20content%20slot%20328661e9d9fb49ce924fddcdb1ecc777/linking_content.png)

### Canvas behavior

- All dynamic content slots start with their width and height being ‘auto’. You can see a purple dashed outline of 1px height when the height is 0.
  ![Screenshot 2024-09-23 at 15.40.17.png](Dynamic%20content%20slot%20328661e9d9fb49ce924fddcdb1ecc777/canvas_behavior.png)
- If the particular dynamic content slot gets both height and width the purple border indication will be revealed around all of the area it populates.
  ![Screenshot 2024-09-23 at 15.41.07.png](Dynamic%20content%20slot%20328661e9d9fb49ce924fddcdb1ecc777/slots_width_height.png)
- In instances with DCS - while in default state the purple indication is not shown. When hovering above the area of the slot it would show the border and hint to the user that this area is reserved for the DCS.
  ![Screenshot 2024-09-23 at 15.41.37.png](Dynamic%20content%20slot%20328661e9d9fb49ce924fddcdb1ecc777/placeholder.png)

---
