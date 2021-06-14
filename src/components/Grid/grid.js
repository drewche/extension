import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import styles from './grid.module.css';
import cn from 'classnames';
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const randomString = "rgl-8";
const persist = true;
/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
export default class AddRemoveLayout extends React.PureComponent {

  constructor(props) {
    super(props);

    const defaultSetup = getFromLS("default");

    var originalLayouts = getFromLS("layouts");
    originalLayouts = originalLayouts ? originalLayouts : defaultSetup ? defaultSetup.layouts : null;
    var originalItems = getFromLS("items"); 
    originalItems = originalItems ? originalItems : defaultSetup ? defaultSetup.items : null;
    const originalCounter = getFromLS("counter");
    const originalDrag = getFromLS("drag");
    const originalResize = getFromLS("resize");

    this.state = {
      items: originalItems=== undefined? props.defaultItems : JSON.parse(JSON.stringify(originalItems)),
      newCounter: originalCounter === undefined? 0 : JSON.parse(JSON.stringify(originalCounter)),
      layouts: originalLayouts === undefined? {} : JSON.parse(JSON.stringify(originalLayouts)),
      drag: originalDrag === undefined? false : JSON.parse(JSON.stringify(originalDrag)),
      resize: originalResize === undefined? false : JSON.parse(JSON.stringify(originalResize)),
      edit: false,
    };

    this.onAddItem = this.onAddItem.bind(this);
  }

  createElement(el) {
    const removeStyle = {
      position: "absolute",
      right: 0,
      top: 0,
      cursor: "pointer",
      width: "30px",
      height: "30px",
      border: "1px solid white",
      margin: "1px",
      borderRadius: "5px",
    };
    const i = el.add ? "+" : el.i;
    return (
      <div key={i} data-grid={el} className={cn(styles.cell, "flex justify-center items-center")}>
        {i}
        {this.state.edit ?
          <div
            className="flex justify-center items-center"
            style={removeStyle}
            onClick={this.onRemoveItem.bind(this, i)}
          >
            x
          </div> : null
        }
      </div>
    );
  }

  onAddItem() {
    /*eslint no-console: 0*/
    console.log("adding", "n" + this.state.newCounter);
    saveToLS("counter", this.state.newCounter);

    var max_y = Math.max(..._.map(_.filter(this.state.items, (item) => item.x === 0), (item) => item.y));
    var max_x = Math.max(..._.map(_.filter(this.state.items, (item) => item.y === max_y), (item) => item.x));

    var [x,y,w,h] = [max_x,max_y,2,2]

    if (this.state.items.length !== 0) {
      var flag = false;
      const sortedItems = _.sortBy(this.state.items, ["y", "x"]);
      for (var i = 0; i < sortedItems.length - 1; i++) {
        const [first, second] = [sortedItems[i], sortedItems[i+1]]
        const [xstart, xend] = [first.x+first.w, second.x];
        if (xend - xstart >= w) {
          for (var j = 0; j < sortedItems.length; j++) {
            const item = sortedItems[j];
            const [ystart, yend] = [sortedItems[j].y, sortedItems[j].y+sortedItems[j].h]
            if (item.x <= xstart && item.x >= xend && item.y <= ystart && item.y >= yend) {
              break;
            }
          }
          x = xstart;
          y = first.y;
          flag = true;
          break;
        }
      }
      if (!flag) {
        x += 2;
      }
    }

    if (x === 12) {
      x = 0;
      y += 2;
    }

    // Add a new item. It must have a unique key!
    const items = this.state.items.concat({
      i: "n" + this.state.newCounter,
      // x: (this.state.items.length * 2) % 12,
      // y: Infinity, // puts it at the bottom
      x: x,
      y: y,
      w: w,
      h: h,
      resizeHandles: ["s", "w", "e", "n", "se"],
    })
    
    // Increment the counter to ensure key is always unique.
    this.setState({items: items, newCounter: this.state.newCounter + 1});
    saveToLS("items", items);
  }

  onLayoutChange(layout, layouts) {
    saveToLS("layouts", layouts);
    this.setState({ items:layout, layouts: layouts });
    this.props.onLayoutChange(layouts);
  }

  onRemoveItem(i) {
    console.log("removing", i);
    const updated = _.reject(this.state.items, { i: i }) 
    this.setState({ items: updated });
    saveToLS("items", updated);
  }

  resetLayout() {
    clearAllLS();
    const defaultLayouts = getFromLS("default");
    this.setState({ 
      layouts: defaultLayouts ? defaultLayouts.layouts : {},
      counter: 0,
      items: defaultLayouts ? defaultLayouts.items : this.props.defaultItems,
    });
  }

  render() {
    return (

      <div>
        <button 
          onClick={() => {
            var nextState = { edit: !this.state.edit };
            
            if (this.state.edit) {
              nextState = {...nextState, drag: false, resize: false };
            } else {
              nextState = {...nextState, drag: getFromLS('drag'), resize: getFromLS('resize')};
            }
            this.setState(nextState);
          }} 
          className={cn(styles.button,styles.edit_button)}
          style={{ backgroundColor: this.state.edit ? "brown" : "gray"}}
        >
          {this.state.edit ? "Close" : "Edit"}
        </button>
        {this.state.edit ? <>
        <button onClick={this.onAddItem} className={styles.button}>Add Item</button>
        <button onClick={() => this.resetLayout()} className={styles.button}>Reset Layout</button>
        <button 
          onClick={() => {
            this.setState({ drag: !this.state.drag });
            saveToLS("drag", !this.state.drag);
          }}
          className={styles.button}
          style={{ backgroundColor: this.state.drag ? "green" : "red"}}
        >
          Drag {this.state.drag ? "On" : "Off"}
        </button>
        <button 
          onClick={() => {
            this.setState({ resize: !this.state.resize });
            saveToLS("resize", !this.state.resize);
          }} 
          className={styles.button}
          style={{ backgroundColor: this.state.resize ? "green" : "red"}}
        >
          Resize {this.state.resize ? "On" : "Off"}
        </button>
        <button 
          onClick={() => {
            saveToLS("default", { layouts: this.state.layouts, items: this.state.items });
          }} 
          className={styles.button}
          style={{ backgroundColor: "brown"}}
        >
          Set Default
        </button>
        </> : <div style={{height:"56px"}}></div>}
        <ResponsiveReactGridLayout
          className="layout"
          layouts={this.state.layouts}
          onLayoutChange={(layout, layouts) =>
            this.onLayoutChange(layout, layouts)
          }
          isDraggable={this.state.drag}
          isResizable={this.state.resize}
          compactType={this.props.compactType}
          isBounded={this.props.isBounded}
          // onBreakpointChange={this.onBreakpointChange}
        >
          {_.map(this.state.items, el => this.createElement(el))}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem(randomString + "_" + key)) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (persist) {
    if (global.localStorage) {
      global.localStorage.setItem(
        randomString + "_" + key,
        JSON.stringify({
          [key]: value
        })
      );
    }
  }
}

function clearAllLS() {
  if (global.localStorage) {
    global.localStorage.removeItem(randomString + "_" + "counter");
    global.localStorage.removeItem(randomString + "_" + "items");
    global.localStorage.removeItem(randomString + "_" + "layouts");
  }
}

