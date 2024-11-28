import { Agent } from '../agent/agent.js';
import yargs from 'yargs';

// Add global unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', {
        promise: promise,
        reason: reason,
        stack: reason?.stack || 'No stack trace'
    });
    process.exit(1);
});

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log('Usage: node init_agent.js <agent_name> [profile] [load_memory] [init_message]');
    process.exit(1);
}

const argv = yargs(args)
    .option('profile', {
        alias: 'p',
        type: 'string',
        description: 'profile filepath to use for agent'
    })
    .option('agent_task_path', {
        alias: 'a',
        type: 'string',
        description: 'path for specifying agent specific attributes',
    })
    .option('task_specification', {
        alias: 't',
        type: 'string',
        description: 'path for specifying high level goals',
    })
    .option('load_memory', {
        alias: 'l',
        type: 'boolean',
        description: 'load agent memory from file on startup'
    })
    .option('init_message', {
        alias: 'm',
        type: 'string',
        description: 'automatically prompt the agent on startup'
    })
    .option('task', {
        alias: 't',
        type: 'string',
        description: 'task ID to execute'
    })
    .option('count_id', {
        alias: 'c',
        type: 'number',
        default: 0,
        description: 'identifying count for multi-agent scenarios',
    }).argv;

// Wrap agent start in async IIFE with proper error handling
(async () => {
    try {
        console.log('Starting agent with profile:', argv.profile);
        const agent = new Agent();
        await agent.start(argv.profile, argv.load_memory, argv.init_message, argv.count_id, argv.task);
    } catch (error) {
        console.error('Failed to start agent process:', {
            message: error.message || 'No error message',
            stack: error.stack || 'No stack trace',
            error: error
        });
        process.exit(1);
    }
})();
