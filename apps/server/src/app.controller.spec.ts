import { Test, TestingModule } from "@nestjs/testing"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"

type DemoTransporter = "primary" | "secondary" | "fallback"

describe("AppController", () => {
    let controller: AppController
    let getHello: jest.Mock
    let sendBasicTextDemo: jest.Mock
    let sendAddressStructuresDemo: jest.Mock
    let sendEnvelopeOptionsDemo: jest.Mock
    let sendTemplateContentDemo: jest.Mock
    let sendAttachmentsDemo: jest.Mock
    let sendAllDemos: jest.Mock

    beforeEach(async () => {
        getHello = jest.fn().mockReturnValue("Hello test!")
        sendBasicTextDemo = jest.fn().mockResolvedValue("basic demo sent")
        sendAddressStructuresDemo = jest
            .fn()
            .mockResolvedValue("address demo sent")
        sendEnvelopeOptionsDemo = jest
            .fn()
            .mockResolvedValue("envelope demo sent")
        sendTemplateContentDemo = jest
            .fn()
            .mockResolvedValue("template demo sent")
        sendAttachmentsDemo = jest
            .fn()
            .mockResolvedValue("attachments demo sent")
        sendAllDemos = jest.fn().mockResolvedValue("all demos sent")

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [
                {
                    provide: AppService,
                    useValue: {
                        getHello,
                        sendBasicTextDemo,
                        sendAddressStructuresDemo,
                        sendEnvelopeOptionsDemo,
                        sendTemplateContentDemo,
                        sendAttachmentsDemo,
                        sendAllDemos
                    }
                }
            ]
        }).compile()

        controller = module.get<AppController>(AppController)
    })

    it("returns the hello message from the service", () => {
        expect(controller.getHello()).toBe("Hello test!")
        expect(getHello).toHaveBeenCalledTimes(1)
    })

    it("forwards basic demo requests to the service", async () => {
        const to = "demo@example.com"
        const transporter: DemoTransporter = "primary"

        await expect(controller.sendBasicDemo(to, transporter)).resolves.toBe(
            "basic demo sent"
        )
        expect(sendBasicTextDemo).toHaveBeenCalledWith(to, transporter)
    })

    it("forwards address structure demo requests to the service", async () => {
        const to = "address@example.com"
        const transporter: DemoTransporter = "secondary"

        await expect(
            controller.sendAddressStructuresDemo(to, transporter)
        ).resolves.toBe("address demo sent")
        expect(sendAddressStructuresDemo).toHaveBeenCalledWith(to, transporter)
    })

    it("forwards envelope demo requests to the service", async () => {
        const to = "envelope@example.com"
        const transporter: DemoTransporter = "fallback"

        await expect(
            controller.sendEnvelopeOptionsDemo(to, transporter)
        ).resolves.toBe("envelope demo sent")
        expect(sendEnvelopeOptionsDemo).toHaveBeenCalledWith(to, transporter)
    })

    it("forwards template demo requests to the service", async () => {
        const to = "template@example.com"

        await expect(controller.sendTemplateContentDemo(to)).resolves.toBe(
            "template demo sent"
        )
        expect(sendTemplateContentDemo).toHaveBeenCalledWith(to, undefined)
    })

    it("forwards attachments demo requests to the service", async () => {
        const transporter: DemoTransporter = "primary"

        await expect(
            controller.sendAttachmentsDemo(undefined, transporter)
        ).resolves.toBe("attachments demo sent")
        expect(sendAttachmentsDemo).toHaveBeenCalledWith(undefined, transporter)
    })

    it("forwards all demo requests to the service", async () => {
        const to = "all@example.com"
        const transporter: DemoTransporter = "secondary"

        await expect(controller.sendAllDemos(to, transporter)).resolves.toBe(
            "all demos sent"
        )
        expect(sendAllDemos).toHaveBeenCalledWith(to, transporter)
    })
})
