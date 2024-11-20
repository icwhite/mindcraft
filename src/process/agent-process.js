import { spawn } from 'child_process';
import { loadTask } from '../utils/tasks.js';

export class AgentProcess {
    static runningCount = 0;

    start(profile, 
        load_memory=false, 
        init_message=null, 
        count_id=0, 
        task=null) {
        let args = ['src/process/init-agent.js', this.name];
        args.push('-p', profile);
        args.push('-c', count_id);
        if (load_memory)
            args.push('-l', load_memory);
        if (init_message)
            args.push('-m', init_message);
        if (task)
            args.push('-t', task);

        const agentProcess = spawn('node', args, {
            stdio: 'inherit',
            stderr: 'inherit',
        });
        AgentProcess.runningCount++;

        
        let last_restart = Date.now();
        agentProcess.on('exit', (code, signal) => {
            console.log(`Agent process exited with code ${code} and signal ${signal}`);

            if (code === 2) {
                console.log("Task completed successfully");
                process.exit(2);
            }

            if (code === 3) {
                console.error("Timeout reached. Exiting.");
                process.exit(3);
            }
            
            if (code !== 0) {
                // agent must run for at least 10 seconds before restarting
                if (Date.now() - last_restart < 10000) {
                    console.error(`Agent process ${profile} exited too quickly and will not be restarted.`);
                    AgentProcess.runningCount--;
                    if (AgentProcess.runningCount <= 0) {
                        console.error('All agent processes have ended. Exiting.');
                        process.exit(0);
                    }
                    return;
                }
                console.log('Restarting agent...');
                this.start(profile, true, 'Agent process restarted.', count_id, task);
                last_restart = Date.now();
            }

            if (code === 0) {
                console.log("Agent process completed successfully");
                process.exit(0);
            }
        });
    
        agentProcess.on('error', (err) => {
            console.error('Failed to start agent process:', err);
        });
    }
}