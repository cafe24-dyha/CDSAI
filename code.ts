// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Runs this code if the plugin is run in Figma
if (figma.editorType === "figma") {
  // This plugin will open a window to prompt the user to enter a number, and
  // it will then create that many rectangles on the screen.

  // This shows the HTML page in "ui.html".
  figma.showUI(__html__);

  // Calls to "parent.postMessage" from within the HTML page will trigger this
  // callback. The callback will be passed the "pluginMessage" property of the
  // posted message.
  figma.ui.onmessage = (msg: { type: string; count: number }) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === "create-shapes") {
      // This plugin creates rectangles on the screen.
      const numberOfRectangles = msg.count;

      const nodes: SceneNode[] = [];
      for (let i = 0; i < numberOfRectangles; i++) {
        const rect = figma.createRectangle();
        rect.x = i * 150;
        rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
        figma.currentPage.appendChild(rect);
        nodes.push(rect);
      }
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
    }

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
  };
}

// Runs this code if the plugin is run in FigJam
if (figma.editorType === "figjam") {
  // This plugin will open a window to prompt the user to enter a number, and
  // it will then create that many shapes and connectors on the screen.

  // This shows the HTML page in "ui.html".
  figma.showUI(__html__);

  // Calls to "parent.postMessage" from within the HTML page will trigger this
  // callback. The callback will be passed the "pluginMessage" property of the
  // posted message.
  figma.ui.onmessage = (msg: { type: string; count: number }) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === "create-shapes") {
      // This plugin creates shapes and connectors on the screen.
      const numberOfShapes = msg.count;

      const nodes: SceneNode[] = [];
      for (let i = 0; i < numberOfShapes; i++) {
        const shape = figma.createShapeWithText();
        // You can set shapeType to one of: 'SQUARE' | 'ELLIPSE' | 'ROUNDED_RECTANGLE' | 'DIAMOND' | 'TRIANGLE_UP' | 'TRIANGLE_DOWN' | 'PARALLELOGRAM_RIGHT' | 'PARALLELOGRAM_LEFT'
        shape.shapeType = "ROUNDED_RECTANGLE";
        shape.x = i * (shape.width + 200);
        shape.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
        figma.currentPage.appendChild(shape);
        nodes.push(shape);
      }

      for (let i = 0; i < numberOfShapes - 1; i++) {
        const connector = figma.createConnector();
        connector.strokeWeight = 8;

        connector.connectorStart = {
          endpointNodeId: nodes[i].id,
          magnet: "AUTO",
        };

        connector.connectorEnd = {
          endpointNodeId: nodes[i + 1].id,
          magnet: "AUTO",
        };
      }

      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
    }

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
  };
}

// Runs this code if the plugin is run in Slides
if (figma.editorType === "slides") {
  // This plugin will open a window to prompt the user to enter a number, and
  // it will then create that many slides on the screen.

  // This shows the HTML page in "ui.html".
  figma.showUI(__html__);

  // Calls to "parent.postMessage" from within the HTML page will trigger this
  // callback. The callback will be passed the "pluginMessage" property of the
  // posted message.
  figma.ui.onmessage = (msg: { type: string; count: number }) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === "create-shapes") {
      // This plugin creates slides and puts the user in grid view.
      const numberOfSlides = msg.count;

      const nodes: SlideNode[] = [];
      for (let i = 0; i < numberOfSlides; i++) {
        const slide = figma.createSlide();
        nodes.push(slide);
      }

      figma.viewport.slidesView = "grid";
      figma.currentPage.selection = nodes;
    }

    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
  };
}

// This plugin will open a window to prompt the user to enter a message
// and get a response from OpenAI Assistant

// Show the plugin UI (400x600 크기로 UI 표시)
figma.showUI(__html__, { width: 400, height: 600 });

interface PluginMessage {
  type: string;
  status?: string;
  message?: string;
}

// UI와의 메시지 통신
figma.ui.onmessage = async (msg: PluginMessage) => {
  try {
    console.log("받은 메시지:", msg);
    switch (msg.type) {
      case "error":
        figma.notify("오류: " + msg.message);
        break;
      case "initComplete":
        figma.notify("초기화 완료");
        break;
      case "ready":
        console.log("UI 준비됨");
        figma.ui.postMessage({ type: "init" });
        break;
      default:
        console.log("알 수 없는 메시지:", msg);
    }
  } catch (error) {
    console.error("메시지 처리 오류:", error);
    figma.notify(
      "오류가 발생했습니다: " +
        (error instanceof Error ? error.message : String(error))
    );
  }
};
