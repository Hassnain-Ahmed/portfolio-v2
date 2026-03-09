import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useRef, useMemo } from "react";
import { NODE_WIDTH, NODE_HEIGHT } from "./processData";
import type { ProcessNodeDef, EdgeDef } from "./processData";
import ProcessNode from "./ProcessNode";
import ProcessEdge from "./ProcessEdge";
import type { EdgeProgress } from "./useProcessScroll";

const nodeTypes = { processNode: ProcessNode };
const edgeTypes = { processEdge: ProcessEdge };

interface ProcessFlowProps {
  nodes: ProcessNodeDef[];
  edges: EdgeDef[];
  activeStep: number;
  edgeProgress: EdgeProgress;
  hoveredStep: number | null;
  setHoveredStep: (s: number | null) => void;
}

function ProcessFlowInner({
  nodes: nodeData,
  edges: edgeData,
  activeStep,
  edgeProgress,
  hoveredStep,
  setHoveredStep,
}: ProcessFlowProps) {
  const { fitView, setCenter } = useReactFlow();
  const hasZoomedOut = useRef(false);
  const prevStep = useRef(-2);

  useEffect(() => {
    if (nodeData.length === 0) return;
    const isFirstRender = prevStep.current === -2;
    prevStep.current = activeStep;

    if (activeStep === nodeData.length - 1 && !hasZoomedOut.current) {
      hasZoomedOut.current = true;
      const launchNode = nodeData[nodeData.length - 1];
      setCenter(
        launchNode.position.x + NODE_WIDTH / 2,
        launchNode.position.y + NODE_HEIGHT / 2,
        { zoom: 1.15, duration: isFirstRender ? 0 : 650 }
      );
      setTimeout(() => {
        fitView({ duration: 1400, padding: 0.18, minZoom: 0.3, maxZoom: 0.9 });
      }, 1500);
      return;
    }

    if (activeStep < nodeData.length - 1) {
      hasZoomedOut.current = false;
    }

    const targetIndex = Math.max(0, activeStep);
    const node = nodeData[targetIndex];
    if (node) {
      setCenter(
        node.position.x + NODE_WIDTH / 2,
        node.position.y + NODE_HEIGHT / 2,
        { zoom: 1.15, duration: isFirstRender ? 0 : 650 }
      );
    }
  }, [activeStep, setCenter, fitView, nodeData]);

  const nodes: Node[] = useMemo(
    () =>
      nodeData.map((n, i) => ({
        id: n.id,
        type: "processNode",
        position: n.position,
        data: {
          ...n.data,
          isVisible: i === 0 || i <= activeStep,
          isActive: i === activeStep,
          isCompleted: i < activeStep,
          isHighlighted: hoveredStep !== null && i <= hoveredStep,
          stepIndex: i,
          onHoverEnter: () => setHoveredStep(i),
          onHoverLeave: () => setHoveredStep(null),
        },
        draggable: false,
        selectable: false,
      })),
    [activeStep, hoveredStep, setHoveredStep, nodeData]
  );

  const edges: Edge[] = useMemo(
    () =>
      edgeData.map((e, i) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: "processEdge",
        data: {
          isVisible: i < activeStep,
          isDrawing: i === edgeProgress.fromStep,
          drawProgress: edgeProgress.progress,
          isHighlighted: hoveredStep !== null && i < hoveredStep,
        },
      })),
    [activeStep, edgeProgress, hoveredStep, edgeData]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      minZoom={0.2}
      maxZoom={1.8}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      panOnScroll={false}
      panOnDrag={false}
      preventScrolling={false}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      proOptions={{ hideAttribution: true }}
      style={{ background: "transparent" }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={28}
        size={1}
        color="rgba(124, 58, 237, 0.06)"
      />
    </ReactFlow>
  );
}

export default function ProcessFlow(props: ProcessFlowProps) {
  return (
    <ReactFlowProvider>
      <ProcessFlowInner {...props} />
    </ReactFlowProvider>
  );
}
