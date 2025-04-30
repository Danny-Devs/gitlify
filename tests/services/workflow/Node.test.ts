import { Node } from '@/app/services/workflow/Node';
import { NodeStatus } from '@/app/services/workflow/types';

// Create a test implementation of the Node class
class TestNode extends Node {
  prepImplementation = jest.fn();
  execImplementation = jest.fn();
  postImplementation = jest.fn();
}

describe('Node', () => {
  let node: TestNode;
  const initialState = {
    nodeId: 'test-node',
    status: NodeStatus.IDLE,
    data: { testValue: 'initial' },
    error: null
  };

  beforeEach(() => {
    node = new TestNode(initialState);
  });

  test('initializes with correct state', () => {
    expect(node.getState()).toEqual(initialState);
  });

  test('updates state correctly', () => {
    node.updateState({
      status: NodeStatus.RUNNING,
      data: { testValue: 'updated' }
    });

    expect(node.getState()).toEqual({
      nodeId: 'test-node',
      status: NodeStatus.RUNNING,
      data: { testValue: 'updated' },
      error: null
    });
  });

  test('preserves existing data when partially updating', () => {
    node.updateState({
      status: NodeStatus.RUNNING,
      data: { newValue: 'added' }
    });

    expect(node.getState()).toEqual({
      nodeId: 'test-node',
      status: NodeStatus.RUNNING,
      data: { testValue: 'initial', newValue: 'added' },
      error: null
    });
  });

  test('sets error state correctly', () => {
    node.setError('Test error');

    expect(node.getState()).toEqual({
      nodeId: 'test-node',
      status: NodeStatus.ERROR,
      data: { testValue: 'initial' },
      error: 'Test error'
    });
  });

  test('lifecycle methods call implementations in order', async () => {
    // Mock successful implementation
    node.prepImplementation.mockResolvedValue(true);
    node.execImplementation.mockResolvedValue({ result: 'success' });
    node.postImplementation.mockResolvedValue(true);

    await node.prep();
    expect(node.prepImplementation).toHaveBeenCalled();
    expect(node.getState().status).toBe(NodeStatus.READY);

    await node.exec();
    expect(node.execImplementation).toHaveBeenCalled();
    expect(node.getState().status).toBe(NodeStatus.COMPLETED);
    expect(node.getState().data).toEqual({
      testValue: 'initial',
      result: 'success'
    });

    await node.post();
    expect(node.postImplementation).toHaveBeenCalled();
  });

  test('handles error in prep phase', async () => {
    // Mock failed implementation
    node.prepImplementation.mockRejectedValue(new Error('Prep failed'));

    await node.prep();
    expect(node.getState().status).toBe(NodeStatus.ERROR);
    expect(node.getState().error).toBe('Prep failed');
  });

  test('handles error in exec phase', async () => {
    // Mock successful prep but failed exec
    node.prepImplementation.mockResolvedValue(true);
    node.execImplementation.mockRejectedValue(new Error('Exec failed'));

    await node.prep();
    expect(node.getState().status).toBe(NodeStatus.READY);

    await node.exec();
    expect(node.getState().status).toBe(NodeStatus.ERROR);
    expect(node.getState().error).toBe('Exec failed');
  });

  test('handles error in post phase', async () => {
    // Mock successful prep and exec but failed post
    node.prepImplementation.mockResolvedValue(true);
    node.execImplementation.mockResolvedValue({ result: 'success' });
    node.postImplementation.mockRejectedValue(new Error('Post failed'));

    await node.prep();
    await node.exec();
    await node.post();

    expect(node.getState().status).toBe(NodeStatus.ERROR);
    expect(node.getState().error).toBe('Post failed');
  });

  test('run executes complete lifecycle', async () => {
    // Mock successful implementations
    node.prepImplementation.mockResolvedValue(true);
    node.execImplementation.mockResolvedValue({ result: 'success' });
    node.postImplementation.mockResolvedValue(true);

    await node.run();

    expect(node.prepImplementation).toHaveBeenCalled();
    expect(node.execImplementation).toHaveBeenCalled();
    expect(node.postImplementation).toHaveBeenCalled();
    expect(node.getState().status).toBe(NodeStatus.COMPLETED);
  });

  test('run stops on first error', async () => {
    // Mock failed prep implementation
    node.prepImplementation.mockRejectedValue(new Error('Prep failed'));

    await node.run();

    expect(node.prepImplementation).toHaveBeenCalled();
    expect(node.execImplementation).not.toHaveBeenCalled();
    expect(node.postImplementation).not.toHaveBeenCalled();
    expect(node.getState().status).toBe(NodeStatus.ERROR);
  });
});
