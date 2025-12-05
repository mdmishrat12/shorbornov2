const WebSocket = require('ws');
const http = require('http');

class ExamWebSocketServer {
  constructor(port = 3001) {
    this.port = port;
    this.server = http.createServer();
    this.wss = new WebSocket.Server({ server: this.server });
    this.examRooms = new Map(); // examId -> Set of connections
    this.connections = new Map(); // connectionId -> { ws, examId, userId }
    
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      const connectionId = this.generateConnectionId();
      console.log('New WebSocket connection:', connectionId);

      // Parse query parameters
      const url = new URL(req.url, `http://${req.headers.host}`);
      const examId = url.searchParams.get('examId');
      const userId = url.searchParams.get('userId');
      const attemptId = url.searchParams.get('attemptId');

      // Store connection
      this.connections.set(connectionId, { ws, examId, userId, attemptId });

      // Add to exam room
      if (examId) {
        if (!this.examRooms.has(examId)) {
          this.examRooms.set(examId, new Set());
        }
        this.examRooms.get(examId).add(connectionId);
      }

      // Handle messages
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(connectionId, message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      // Handle close
      ws.on('close', () => {
        console.log('WebSocket disconnected:', connectionId);
        this.handleDisconnection(connectionId);
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'welcome',
        connectionId,
        timestamp: Date.now(),
      }));
    });

    this.server.listen(this.port, () => {
      console.log(`WebSocket server running on port ${this.port}`);
    });

    // Heartbeat to keep connections alive
    setInterval(() => {
      this.connections.forEach(({ ws }, connectionId) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'heartbeat',
            timestamp: Date.now(),
          }));
        }
      });
    }, 30000);
  }

  handleMessage(connectionId, message) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    switch (message.type) {
      case 'heartbeat':
        // Update last activity
        connection.lastActivity = Date.now();
        break;

      case 'answer_update':
        // Broadcast to invigilators in same exam
        this.broadcastToExam(connection.examId, {
          type: 'answer_update',
          userId: connection.userId,
          questionNumber: message.questionNumber,
          timestamp: Date.now(),
        }, connectionId);
        break;

      case 'time_sync':
        connection.ws.send(JSON.stringify({
          type: 'time_sync',
          serverTime: Date.now(),
        }));
        break;

      case 'request_help':
        // Notify invigilators
        this.broadcastToExamAdmins(connection.examId, {
          type: 'help_request',
          userId: connection.userId,
          attemptId: connection.attemptId,
          message: message.message,
          timestamp: Date.now(),
        });
        break;
    }
  }

  handleDisconnection(connectionId) {
    const connection = this.connections.get(connectionId);
    if (connection) {
      // Remove from exam room
      if (connection.examId && this.examRooms.has(connection.examId)) {
        this.examRooms.get(connection.examId).delete(connectionId);
      }
      
      // Remove connection
      this.connections.delete(connectionId);
      
      // Notify others in exam room
      this.broadcastToExam(connection.examId, {
        type: 'user_disconnected',
        userId: connection.userId,
        timestamp: Date.now(),
      });
    }
  }

  broadcastToExam(examId, message, excludeConnectionId = null) {
    if (!this.examRooms.has(examId)) return;

    this.examRooms.get(examId).forEach(connectionId => {
      if (connectionId === excludeConnectionId) return;
      
      const connection = this.connections.get(connectionId);
      if (connection && connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.send(JSON.stringify(message));
      }
    });
  }

  broadcastToExamAdmins(examId, message) {
    // Filter connections for invigilators/admins
    this.broadcastToExam(examId, message);
  }

  generateConnectionId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // External API methods
  sendAnnouncement(examId, announcement) {
    this.broadcastToExam(examId, {
      type: 'announcement',
      message: announcement,
      timestamp: Date.now(),
    });
  }

  sendWarning(examId, userId, warning) {
    const connection = Array.from(this.connections.values())
      .find(conn => conn.examId === examId && conn.userId === userId);
    
    if (connection && connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(JSON.stringify({
        type: 'warning',
        message: warning,
        timestamp: Date.now(),
      }));
    }
  }

  forceSubmit(examId, userId) {
    const connection = Array.from(this.connections.values())
      .find(conn => conn.examId === examId && conn.userId === userId);
    
    if (connection && connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(JSON.stringify({
        type: 'force_submit',
        message: 'Exam has been force-submitted by invigilator',
        timestamp: Date.now(),
      }));
    }
  }
}

module.exports = ExamWebSocketServer;