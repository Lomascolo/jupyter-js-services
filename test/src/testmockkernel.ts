// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import expect = require('expect.js');

import {
  KernelMessage
} from '../../lib/ikernel';

import {
  MockKernel
} from '../../lib/mockkernel';


describe('mockkernel', () => {

  describe('MockKernel', () => {

    describe('#constructor()', () => {

      it('should accept no arguments', () => {
        let kernel = new MockKernel();
        expect(kernel).to.be.a(MockKernel);
      });

      it('should accept a kernel model', () => {
        let kernel = new MockKernel({ name: 'shell' });
        expect(kernel.name).to.be('shell');
      });

    });

    describe('#interrupt()', () => {

      it('should change the status to busy then idle', (done) => {
        let kernel = new MockKernel();
        kernel.interrupt().then(() => {
          expect(kernel.status).to.be('idle');
          done();
        });
        expect(kernel.status).to.be('busy');
      });

    });

    describe('#restart()', () => {

      it('should change the status to restarting then idle', (done) => {
        let kernel = new MockKernel();
        kernel.restart().then(() => {
          expect(kernel.status).to.be('idle');
          done();
        });
        expect(kernel.status).to.be('restarting');
      });

    });

    describe('#kernelInfo()', () => {

      it('should get the kernel info for the mock kernel', (done) => {
        let kernel = new MockKernel();
        expect(kernel.name).to.be('python');
        kernel.kernelInfo().then(reply => {
          expect(reply.content.language_info.name).to.be('python');
          done();
        });
      });

    });

    describe('#execute()', () => {

      it('should execute the code on the mock kernel', (done) => {
        let kernel = new MockKernel();
        let future = kernel.execute({ code: 'a = 1'});
        future.onDone = () => { done(); };
      });

      it('should emit one iopub stream message', (done) => {
        let kernel = new MockKernel();
        let future = kernel.execute({ code: 'a = 1'});
        let called = 0;
        future.onIOPub = (msg) => {
          if (msg.header.msg_type !== 'status') {
            called++;
          }
        };
        future.onDone = () => {
          expect(called).to.be(1);
          done();
        };
      });

      it('should increment the execution count', (done) => {
        let kernel = new MockKernel();
        let future = kernel.execute({ code: 'a = 1' });
        future.onReply = (reply: KernelMessage.IExecuteReplyMsg)  => {
          expect(reply.content.execution_count).to.be(1);
        };
        future.onDone = () => {
          future = kernel.execute({ code: 'a = 1' });
          future.onReply = (reply: KernelMessage.IExecuteReplyMsg) => {
            expect(reply.content.execution_count).to.be(2);
            done();
          };
        };
      });

    });

    describe('#getKernelSpec()', () => {

      it('should get the kernel spec for the mock kernel', (done) => {
        let kernel = new MockKernel({ name: 'shell' });
        expect(kernel.name).to.be('shell');
        kernel.getKernelSpec().then(spec => {
          expect(spec.display_name).to.be('Shell');
          done();
        });
      });

    });

  });

});
