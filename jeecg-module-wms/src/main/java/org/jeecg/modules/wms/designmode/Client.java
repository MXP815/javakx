package org.jeecg.modules.wms.designmode;

/**
 * @author Mr.M
 * @version 1.0
 * @description TODO
 * @date 2025/9/7 17:29
 */
public class Client {
    public static void main(String[] args) {
        // 创建处理者
        Approver projectManager = new ProjectManager();//项目经理
        Approver departmentManager = new DepartmentManager();// 部门经理
        Approver generalManager = new GeneralManager();// 总经理
        //   Approver generalManager  = new 董事长

        // 设置责任链
        projectManager.setNextApprover(departmentManager);// 项目经理的下一步是部门经理
        departmentManager.setNextApprover(generalManager);// 部门经理的下一个是总经理

        // 创建请求
        PurchaseRequest request1 = new PurchaseRequest(1, 800, "购买办公用品");// 项目经理
        PurchaseRequest request2 = new PurchaseRequest(2, 3500, "购买服务器");// 部门经理
        PurchaseRequest request3 = new PurchaseRequest(3, 10000, "购买新设备");// 总经理

        // 处理请求
//        projectManager.processRequest(request1);
//        projectManager.processRequest(request2);
        projectManager.processRequest(request3);
    }
}
